
DELIMITER $$
CREATE TRIGGER after_registration_insert
AFTER INSERT ON registrations
FOR EACH ROW
BEGIN
    -- Log the registration activity
    INSERT INTO event_activity_log (event_id, user_id, action, timestamp)
    VALUES (NEW.event_id, NEW.user_id, 'REGISTERED', NOW());
    
    -- Update registration count for the event (if you have an event_stats table)
    -- UPDATE event_stats 
    -- SET registration_count = registration_count + 1 
    -- WHERE event_id = NEW.event_id;
END$$

-- 2. TRIGGER: Prevent duplicate registrations for the same user and event
CREATE TRIGGER before_registration_insert
BEFORE INSERT ON registrations
FOR EACH ROW
BEGIN
    DECLARE registration_count INT DEFAULT 0;
    
    -- Check if user is already registered for this event
    SELECT COUNT(*) INTO registration_count
    FROM registrations 
    WHERE user_id = NEW.user_id AND event_id = NEW.event_id;
    
    -- If already registered, prevent insertion
    IF registration_count > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'User is already registered for this event';
    END IF;
END$$

-- 3. TRIGGER: Update attendance statistics when attendance is marked
CREATE TRIGGER after_attendance_update
AFTER UPDATE ON registrations
FOR EACH ROW
BEGIN
    -- Only trigger when attended status changes from false to true
    IF OLD.attended = 0 AND NEW.attended = 1 THEN
        -- Log attendance activity
        INSERT INTO event_activity_log (event_id, user_id, action, timestamp)
        VALUES (NEW.event_id, NEW.user_id, 'ATTENDED', NOW());
        
        -- Update attendance count for the event
        -- UPDATE event_stats 
        -- SET attendance_count = attendance_count + 1 
        -- WHERE event_id = NEW.event_id;
    END IF;
END$$

-- 4. TRIGGER: Log feedback submission
CREATE TRIGGER after_feedback_insert
AFTER INSERT ON feedbacks
FOR EACH ROW
BEGIN
    -- Log feedback submission
    INSERT INTO event_activity_log (event_id, user_id, action, timestamp)
    VALUES (NEW.event_id, NEW.user_id, 'FEEDBACK_SUBMITTED', NOW());
    
    -- Update feedback count and average rating for the event
    -- UPDATE event_stats 
    -- SET feedback_count = feedback_count + 1,
    --     average_rating = (
    --         SELECT AVG(rating) 
    --         FROM feedbacks 
    --         WHERE event_id = NEW.event_id
    --     )
    -- WHERE event_id = NEW.event_id;
END$$

-- 5. TRIGGER: Prevent feedback from users who didn't attend the event
CREATE TRIGGER before_feedback_insert
BEFORE INSERT ON feedbacks
FOR EACH ROW
BEGIN
    DECLARE attendance_status INT DEFAULT 0;
    
    -- Check if user attended the event
    SELECT attended INTO attendance_status
    FROM registrations 
    WHERE user_id = NEW.user_id AND event_id = NEW.event_id;
    
    -- If user didn't attend, prevent feedback submission
    IF attendance_status = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Only users who attended the event can submit feedback';
    END IF;
END$$

-- 6. TRIGGER: Prevent registration for past events
CREATE TRIGGER before_registration_insert_past_event
BEFORE INSERT ON registrations
FOR EACH ROW
BEGIN
    DECLARE event_date DATETIME;
    
    -- Get the event date
    SELECT date INTO event_date
    FROM events 
    WHERE id = NEW.event_id;
    
    -- If event date is in the past, prevent registration
    IF event_date < NOW() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot register for past events';
    END IF;
END$$

-- 7. TRIGGER: Update user role statistics
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    -- Log new user registration
    INSERT INTO system_log (action, details, timestamp)
    VALUES ('USER_REGISTERED', CONCAT('New user registered: ', NEW.name, ' (', NEW.email, ') as ', NEW.role), NOW());
END$$

-- 8. TRIGGER: Log event creation
CREATE TRIGGER after_event_insert
AFTER INSERT ON events
FOR EACH ROW
BEGIN
    -- Log new event creation
    INSERT INTO system_log (action, details, timestamp)
    VALUES ('EVENT_CREATED', CONCAT('New event created: ', NEW.title, ' by organizer ', NEW.organizer_id), NOW());
END$$

-- 9. TRIGGER: Clean up related data when user is deleted
CREATE TRIGGER before_user_delete
BEFORE DELETE ON users
FOR EACH ROW
BEGIN
    -- Delete all registrations for this user
    DELETE FROM registrations WHERE user_id = OLD.id;
    
    -- Delete all feedback from this user
    DELETE FROM feedbacks WHERE user_id = OLD.id;
    
    -- Log user deletion
    INSERT INTO system_log (action, details, timestamp)
    VALUES ('USER_DELETED', CONCAT('User deleted: ', OLD.name, ' (', OLD.email, ')'), NOW());
END$$

-- 10. TRIGGER: Clean up related data when event is deleted
CREATE TRIGGER before_event_delete
BEFORE DELETE ON events
FOR EACH ROW
BEGIN
    -- Delete all registrations for this event
    DELETE FROM registrations WHERE event_id = OLD.id;
    
    -- Delete all feedback for this event
    DELETE FROM feedbacks WHERE event_id = OLD.id;
    
    -- Log event deletion
    INSERT INTO system_log (action, details, timestamp)
    VALUES ('EVENT_DELETED', CONCAT('Event deleted: ', OLD.title), NOW());
END$$

DELIMITER ;

-- =====================================================
-- SUPPORTING TABLES FOR TRIGGERS
-- =====================================================

-- Create event_activity_log table for tracking activities
CREATE TABLE IF NOT EXISTS event_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    action ENUM('REGISTERED', 'ATTENDED', 'FEEDBACK_SUBMITTED', 'CANCELLED') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_event_activity (event_id, timestamp),
    INDEX idx_user_activity (user_id, timestamp)
);

-- Create system_log table for general system activities
CREATE TABLE IF NOT EXISTS system_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
);

-- Optional: Create event_stats table for aggregated statistics
CREATE TABLE IF NOT EXISTS event_stats (
    event_id INT PRIMARY KEY,
    registration_count INT DEFAULT 0,
    attendance_count INT DEFAULT 0,
    feedback_count INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- =====================================================
-- USEFUL STORED PROCEDURES
-- =====================================================

-- Procedure to get event statistics
DELIMITER $$
CREATE PROCEDURE GetEventStats(IN event_id_param INT)
BEGIN
    SELECT 
        e.id,
        e.title,
        e.date,
        e.location,
        e.category,
        COUNT(DISTINCT r.id) as total_registrations,
        COUNT(DISTINCT CASE WHEN r.attended = 1 THEN r.id END) as total_attendance,
        COUNT(DISTINCT f.id) as total_feedback,
        ROUND(AVG(f.rating), 2) as average_rating
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
    LEFT JOIN feedbacks f ON e.id = f.event_id
    WHERE e.id = event_id_param
    GROUP BY e.id, e.title, e.date, e.location, e.category;
END$$

-- Procedure to get user activity summary
CREATE PROCEDURE GetUserActivity(IN user_id_param INT)
BEGIN
    SELECT 
        u.name,
        u.email,
        u.role,
        COUNT(DISTINCT r.id) as total_registrations,
        COUNT(DISTINCT CASE WHEN r.attended = 1 THEN r.id END) as events_attended,
        COUNT(DISTINCT f.id) as feedback_submitted
    FROM users u
    LEFT JOIN registrations r ON u.id = r.user_id
    LEFT JOIN feedbacks f ON u.id = f.user_id
    WHERE u.id = user_id_param
    GROUP BY u.id, u.name, u.email, u.role;
END$$

DELIMITER ;

-- =====================================================
-- USEFUL VIEWS
-- =====================================================

-- View for event summary with statistics
CREATE VIEW event_summary AS
SELECT 
    e.id,
    e.title,
    e.description,
    e.date,
    e.location,
    e.category,
    u.name as organizer_name,
    COUNT(DISTINCT r.id) as total_registrations,
    COUNT(DISTINCT CASE WHEN r.attended = 1 THEN r.id END) as total_attendance,
    COUNT(DISTINCT f.id) as total_feedback,
    ROUND(AVG(f.rating), 2) as average_rating
FROM events e
LEFT JOIN users u ON e.organizer_id = u.id
LEFT JOIN registrations r ON e.id = r.event_id
LEFT JOIN feedbacks f ON e.id = f.event_id
GROUP BY e.id, e.title, e.description, e.date, e.location, e.category, u.name;

-- View for user activity summary
CREATE VIEW user_activity_summary AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    u.createdAt as member_since,
    COUNT(DISTINCT r.id) as total_registrations,
    COUNT(DISTINCT CASE WHEN r.attended = 1 THEN r.id END) as events_attended,
    COUNT(DISTINCT f.id) as feedback_submitted,
    ROUND(AVG(f.rating), 2) as average_rating_given
FROM users u
LEFT JOIN registrations r ON u.id = r.user_id
LEFT JOIN feedbacks f ON u.id = f.user_id
GROUP BY u.id, u.name, u.email, u.role, u.createdAt;

-- =====================================================
-- EXAMPLE QUERIES TO TEST THE TRIGGERS
-- =====================================================

-- Test duplicate registration prevention
-- INSERT INTO registrations (user_id, event_id) VALUES (2, 1); -- Should fail

-- Test past event registration prevention
-- INSERT INTO registrations (user_id, event_id) VALUES (2, 1); -- Should fail if event is in past

-- Test feedback from non-attendee
-- INSERT INTO feedbacks (user_id, event_id, rating, comments) VALUES (4, 1, 5, 'Great event!'); -- Should fail

-- Test valid operations
-- INSERT INTO registrations (user_id, event_id) VALUES (6, 2); -- Should succeed
-- UPDATE registrations SET attended = 1 WHERE user_id = 6 AND event_id = 2; -- Should succeed
-- INSERT INTO feedbacks (user_id, event_id, rating, comments) VALUES (6, 2, 4, 'Good event!'); -- Should succeed

-- =====================================================
-- CLEANUP COMMANDS (Use with caution!)
-- =====================================================

-- To drop all triggers (if needed):
-- DROP TRIGGER IF EXISTS after_registration_insert;
-- DROP TRIGGER IF EXISTS before_registration_insert;
-- DROP TRIGGER IF EXISTS after_attendance_update;
-- DROP TRIGGER IF EXISTS after_feedback_insert;
-- DROP TRIGGER IF EXISTS before_feedback_insert;
-- DROP TRIGGER IF EXISTS before_registration_insert_past_event;
-- DROP TRIGGER IF EXISTS after_user_insert;
-- DROP TRIGGER IF EXISTS after_event_insert;
-- DROP TRIGGER IF EXISTS before_user_delete;
-- DROP TRIGGER IF EXISTS before_event_delete;
