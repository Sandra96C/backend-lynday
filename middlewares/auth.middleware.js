import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const decoded = verifyToken(req.headers.authorization);

    if (!decoded) return res.status(401).json({ error: "Invalid token" });

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};

const verifyToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const [, token] = authHeader.split(" ");
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const optionalAuth = (req, res, next) => {
  try {
    const decoded = verifyToken(req.headers.authorization);
    if (decoded) req.user = decoded;
  } catch {}
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};
