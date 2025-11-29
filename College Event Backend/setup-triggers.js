const { sequelize } = require('./config/db');
const fs = require('fs');
const path = require('path');

const setupTriggers = async () => {
  try {
    console.log('🚀 Setting up database triggers...');
    
    // Read the essential triggers SQL file
    const triggersPath = path.join(__dirname, 'essential-triggers.sql');
    const triggersSQL = fs.readFileSync(triggersPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = triggersSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sequelize.query(statement);
          console.log('✅ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          console.log('⚠️  Warning:', error.message);
          // Continue with other statements even if one fails
        }
      }
    }
    
    console.log('✅ Database triggers setup completed!');
    
    // Test the triggers with some sample data
    console.log('\n🧪 Testing triggers...');
    
    // Test 1: Try to register user 2 for event 1 again (should fail)
    try {
      await sequelize.query(`
        INSERT INTO registrations (user_id, event_id) 
        VALUES (2, 1)
      `);
      console.log('❌ Test 1 failed: Duplicate registration was allowed');
    } catch (error) {
      console.log('✅ Test 1 passed: Duplicate registration prevented');
    }
    
    // Test 2: Try to submit feedback from user who didn't attend (should fail)
    try {
      await sequelize.query(`
        INSERT INTO feedbacks (user_id, event_id, rating, comments) 
        VALUES (4, 1, 5, 'Test feedback')
      `);
      console.log('❌ Test 2 failed: Feedback from non-attendee was allowed');
    } catch (error) {
      console.log('✅ Test 2 passed: Feedback from non-attendee prevented');
    }
    
    // Test 3: Valid registration (should succeed)
    try {
      await sequelize.query(`
        INSERT INTO registrations (user_id, event_id) 
        VALUES (6, 2)
      `);
      console.log('✅ Test 3 passed: Valid registration succeeded');
    } catch (error) {
      console.log('❌ Test 3 failed: Valid registration was blocked');
    }
    
    console.log('\n🎉 Trigger setup and testing completed!');
    
  } catch (error) {
    console.error('❌ Error setting up triggers:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the setup if this file is executed directly
if (require.main === module) {
  setupTriggers();
}

module.exports = setupTriggers;
