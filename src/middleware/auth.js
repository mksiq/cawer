const jwt = require("jsonwebtoken");

/**
 * Authentication middleware
 * @param request, response, next
 */
function authenticateToken(req, res, next) {
  var token = req.headers["x-access-token"]; //tempToken;// ;
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    req.user = decoded;
    next();
  });
}

module.exports = authenticateToken;
