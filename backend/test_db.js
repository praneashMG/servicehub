const pool = require('./config/db');
pool.query('SELECT ROUND(AVG(rating), 1) as avg_rating, COUNT(id) as total_reviews FROM reviews WHERE service_id = $1', [1])
  .then(res => { console.log("SUCCESS", res.rows); process.exit(0); })
  .catch(err => { console.error("ERROR", err); process.exit(1); });
