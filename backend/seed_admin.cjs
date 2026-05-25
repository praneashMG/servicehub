const pool = require("./config/db");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    console.log("Seeding Admin User...");

    const email = "admin@gmail.com";
    const name = "admin";
    const password = "Admin1234**";

    // Check if admin already exists
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (userExists.rows.length > 0) {
      console.log("Admin user already exists. Updating password and role...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      await pool.query(
        "UPDATE users SET password = $1, role = $2, name = $3 WHERE email = $4",
        [hashedPassword, 'admin', name, email]
      );
      console.log("Admin user updated successfully.");
    } else {
      console.log("Creating new admin user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        [name, email, hashedPassword, 'admin']
      );
      console.log("Admin user created successfully.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
