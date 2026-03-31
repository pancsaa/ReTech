const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const envPath = path.join(__dirname, "..", ".env");
const examplePath = path.join(__dirname, "..", ".env.example");

if (fs.existsSync(envPath)) {
  console.log(".env already exists, skipping.");
  process.exit(0);
}

let content = "";

if (fs.existsSync(examplePath)) {
  content = fs.readFileSync(examplePath, "utf8");
} else {
  content = `DATABASE_URL="mysql://root:123@localhost:3307/retech_db"
PORT=3000
JWT_SECRET="your_super_secret_key_here"
JWT_EXPIRES_IN="1h"
ADMIN_EMAIL="admin@gmail.com"
ADMIN_PASSWORD="admin123"
`;
}

const jwtSecret = crypto.randomBytes(64).toString("base64");

content = content.replace(/JWT_SECRET\s*=\s*"?your_super_secret_key_here"?/, `JWT_SECRET="${jwtSecret}"`);

fs.writeFileSync(envPath, content, "utf8");
console.log(".env created successfully.");