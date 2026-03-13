const crypto = require("node:crypto");
const { findUserByEmail, findUserById } = require("./store");
const { verifyPassword } = require("./passwords");

const sessions = new Map();

function createToken() {
  return crypto.randomBytes(24).toString("hex");
}

function login(email, password) {
  const user = findUserByEmail(email);
  if (!user) return null;
  const ok = verifyPassword(password, user.password_hash);
  if (!ok) return null;

  const token = createToken();
  sessions.set(token, user.id);
  return { token };
}
function register(email){
   const user = findUserByEmail(email);
    const token = createToken();
    sessions.set(token, user.id);
    return { token };
}

function getUserFromToken(token) {
  if (!token) return null;
  const userId = sessions.get(token);
  if (!userId) return null;
  return findUserById(userId);
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or invalid token." });
  }
  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ error: "Invalid token." });
  req.user = user;
  return next();
}

module.exports = { login, requireAuth , register};
