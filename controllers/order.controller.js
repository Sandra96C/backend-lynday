import Counter from "../models/Counter.js";
import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }

    if (order.orderStatus != "draft" && !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid order id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const statusBefore = order.orderStatus;
    const statusAfter = req.body.orderStatus;
    const orderBody = { ...order.toObject(), ...req.body };

    if (statusBefore != "draft" && !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (
      statusAfter == "checkout" &&
      (!orderBody.customer.address ||
        !orderBody.customer.zipCode ||
        !orderBody.customer.city ||
        !orderBody.customer.province ||
        !orderBody.customer.phone ||
        !orderBody.customer.name ||
        !orderBody.customer.email ||
        !orderBody.giftBoxes ||
        !orderBody.giftBoxes.length ||
        !orderBody.totalPrice)
    ) {
      return res
        .status(400)
        .json({ error: "Complete the required fields please" });
    }

    if (
      statusBefore == "draft" &&
      orderBody.payment &&
      orderBody.payment.status == "completed"
    ) {
      orderBody.orderStatus = "pending";
    }

    const orderUpdate = await Order.findByIdAndUpdate(id, orderBody, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json(orderUpdate);
  } catch (error) {
    console.error("Error:", error);
    if (error.name == "ValidationError") {
      return res.status(422).json({ error: error.errors });
    }

    if (error.name == "CastError") {
      return res.status(400).json({ error: "Invalid id" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { customer, giftBoxes, payment, totalPrice, orderStatus } = req.body;

    if (!customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({
        error: "Complete the required fields please",
      });
    }
    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customer,
      giftBoxes,
      totalPrice,
      orderStatus: "draft",
    });

    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

const generateOrderNumber = async () => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: "orderNumber" },
      { $inc: { sequenceValue: 1 } },
      { returnDocument: "after", upsert: true },
    );

    return `ORD-${String(counter.sequenceValue).padStart(4, "0")}`;
  } catch (error) {
    throw new Error(error);
  }
};
