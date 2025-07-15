const jwt = require("jsonwebtoken");
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header is missing" });
    }

    // Extract token from Authorization header
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.users = decoded; // Attach user data to the request object
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: error });
  }
};
