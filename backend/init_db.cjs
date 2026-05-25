const pool = require("./config/db");

const createTables = async () => {
  try {
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const servicesTable = `
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const bookingsTable = `
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
        booking_date TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(usersTable);
    console.log("Users table created");

    await pool.query(servicesTable);
    console.log("Services table created");

    await pool.query(bookingsTable);
    console.log("Bookings table created");

    // Insert mock services if none exist
    const servicesCheck = await pool.query("SELECT COUNT(*) FROM services");
    if (parseInt(servicesCheck.rows[0].count) === 0) {
      const insertMockServices = `
        INSERT INTO services (title, description, price, category, image) VALUES
        ('AC Repair', 'Complete air conditioning repair and maintenance service.', 49.99, 'Repair', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop'),
        ('Plumbing', 'Professional plumbing services for your home and office.', 39.99, 'Maintenance', 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=2070&auto=format&fit=crop'),
        ('Electrician', 'Expert electrical repairs, installations and safety checks.', 59.99, 'Repair', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2069&auto=format&fit=crop'),
        ('Cleaning', 'Deep cleaning services for residential and commercial spaces.', 89.99, 'Cleaning', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop'),
        ('Painting', 'High quality interior and exterior painting services.', 149.99, 'Renovation', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop')
      `;
      await pool.query(insertMockServices);
      console.log("Mock services inserted");
    }

    console.log("Database initialized successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
};

createTables();
