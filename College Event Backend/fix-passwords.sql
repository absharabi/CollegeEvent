-- SQL script to fix malformed passwords
-- Run this in your MySQL database

-- First, let's see the current state
SELECT id, name, email, password, role FROM users;

-- Update users with malformed passwords to a default password
-- The application will hash this when they log in

-- For Abi (admin) - password is just "."
UPDATE users 
SET password = 'password123' 
WHERE id = 1 AND email = 'absharabicr@gmail.com';

-- For karthika (first) - password is incomplete
UPDATE users 
SET password = 'password123' 
WHERE id = 2 AND email = 'akarshkichu@gmail.com';

-- For Hadya - password is incomplete  
UPDATE users 
SET password = 'password123' 
WHERE id = 3 AND email = 'hadyaunais@gmail.com';

-- For Ajin - password is empty
UPDATE users 
SET password = 'password123' 
WHERE id = 4 AND email = 'ajindev@gmail.com';

-- For karthika (second) - password is incomplete
UPDATE users 
SET password = 'password123' 
WHERE id = 5 AND email = 'karthika@gmail.com';

-- Joshua's password looks correct, so we'll leave it alone

-- Verify the changes
SELECT id, name, email, password, role FROM users;
