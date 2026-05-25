const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'servicehub', password: 'pranika1234', port: 5432 });

pool.query("SELECT * FROM users LIMIT 1")
  .then(res => {
    console.log("Users table exists. Columns:", res.fields.map(f => f.name));
  })
  .catch(err => {
    console.error("Error executing query:", err.message);
  })
  .finally(() => pool.end());
