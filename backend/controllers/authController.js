const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    if (newUser.rows.length > 0) {
      // Send welcome email
      try {
        const sendEmail = require("../utils/email");
        await sendEmail({
          email: newUser.rows[0].email,
          subject: "Welcome to ServiceHub!",
          html: `<h1>Welcome to ServiceHub, ${newUser.rows[0].name}!</h1><p>Your account has been created successfully. Explore and book amazing services today!</p>`
        });
      } catch (e) {
        console.error("Failed to send welcome email (non-fatal)", e);
      }

      res.status(201).json({
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        token: generateToken(newUser.rows[0].id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(password, user.rows[0].password);

      if (validPassword) {
        res.json({
          id: user.rows[0].id,
          name: user.rows[0].name,
          email: user.rows[0].email,
          role: user.rows[0].role,
          phone: user.rows[0].phone,
          address: user.rows[0].address,
          profile_image: user.rows[0].profile_image,
          token: generateToken(user.rows[0].id),
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await pool.query("SELECT id, name, email, phone, address, created_at, profile_image, role FROM users WHERE id = $1", [req.user.id]);
    
    if (user.rows.length > 0) {
      res.json(user.rows[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, userId]);
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating password" });
  }
};

const requestAccountDeletion = async (req, res) => {
  const userId = req.user.id;

  try {
    const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [userId]);
    const email = userResult.rows[0].email;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60000);

    await pool.query(
      "UPDATE users SET otp_code = $1, otp_expires = $2 WHERE id = $3",
      [otp, expires, userId]
    );

    let transporter;

    // Use real Gmail if credentials exist in .env
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      // Fallback to Ethereal Test Account
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: '"ServiceHub Security" <security@servicehub.com>',
      to: email,
      subject: "Account Deletion OTP Code",
      text: `Your OTP code to delete your account is: ${otp}. It will expire in 10 minutes.`,
      html: `<b>Your OTP code to delete your account is: ${otp}</b><br>It will expire in 10 minutes.`,
    });

    console.log("OTP Email sent: %s", info.messageId);
    
    // Check if it was an Ethereal email or a real one
    if (!process.env.EMAIL_USER) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("Preview URL: %s", previewUrl);
      return res.json({ 
        message: "OTP sent (Test Mode)",
        previewUrl: previewUrl 
      });
    }

    res.json({ message: "OTP securely sent to your email address" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP email" });
  }
};

const confirmAccountDeletion = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user.id;

  try {
    const userResult = await pool.query("SELECT otp_code, otp_expires FROM users WHERE id = $1", [userId]);
    const user = userResult.rows[0];

    if (!user.otp_code || user.otp_code !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ message: "OTP code has expired" });
    }

    await pool.query("DELETE FROM users WHERE id = $1", [userId]);

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete account" });
  }
};

const updateProfile = async (req, res) => {
  const { name, email, phone, address, profile_image } = req.body;
  const userId = req.user.id;

  try {
    // Dynamic update query builder
    let updates = [];
    let values = [];
    let count = 1;

    if (name) { updates.push(`name = $${count}`); values.push(name); count++; }
    if (email) { updates.push(`email = $${count}`); values.push(email); count++; }
    if (phone !== undefined) { updates.push(`phone = $${count}`); values.push(phone); count++; }
    if (address !== undefined) { updates.push(`address = $${count}`); values.push(address); count++; }
    if (profile_image !== undefined) { updates.push(`profile_image = $${count}`); values.push(profile_image); count++; }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(userId);
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${count} RETURNING id, name, email, role, phone, address, profile_image`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  updateProfile,
  requestAccountDeletion,
  confirmAccountDeletion
};