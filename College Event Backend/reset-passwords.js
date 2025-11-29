// Simple script to reset malformed passwords
// This script will set all malformed passwords to 'password123'

const mysql = require('mysql2/promise');

// Database connection - you'll need to update these with your actual credentials
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Update with your MySQL username
  password: '', // Update with your MySQL password
  database: 'college_event_db' // Update with your database name
});

async function resetPasswords() {
  try {
    const conn = await connection;
    console.log('✅ Connected to database');

    // Get all users
    const [users] = await conn.execute('SELECT id, name, email, password FROM users');
    
    console.log('Current users:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Password: ${user.password}`);
    });

    // Reset passwords for users with malformed hashes
    const malformedUsers = users.filter(user => 
      !user.password || 
      !user.password.startsWith('$2b$') || 
      user.password.length < 50
    );

    console.log(`\nFound ${malformedUsers.length} users with malformed passwords`);

    for (const user of malformedUsers) {
      console.log(`Resetting password for ${user.name} (${user.email})`);
      await conn.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        ['password123', user.id]
      );
    }

    console.log('\n✅ Password reset completed!');
    console.log('All users with malformed passwords now have the password: password123');
    console.log('They can login with this password and then change it.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPlease update the database connection details in this script:');
    console.log('- host: your MySQL host');
    console.log('- user: your MySQL username'); 
    console.log('- password: your MySQL password');
    console.log('- database: your database name');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetPasswords();
