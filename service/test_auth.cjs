const { Pool } = require('../backend/node_modules/pg');
const bcrypt = require('../backend/node_modules/bcryptjs');
const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'servicehub', password: 'pranika1234', port: 5432 });

async function test() {
  try {
    const email = 'test_reg123@gmail.com';
    const password = 'password123';
    const name = 'Test Name';

    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    console.log('userExists count:', userExists.rows.length);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashed password:', hashedPassword);

    const newUser = await pool.query(
      "INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    console.log('newUser inserted:', newUser.rows[0]);
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    pool.end();
  }
}
test();
