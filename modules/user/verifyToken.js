const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied.");
  try {
    const verified = jwt.verify(token, process.env.APP_SECRET);
    req.user_id = verified._id;
    req.user_name = verified.user_name;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
