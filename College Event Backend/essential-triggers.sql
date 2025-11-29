-- =====================================================
-- ESSENTIAL TRIGGERS FOR COLLEGE EVENT MANAGEMENT
-- =====================================================

-- 1. Prevent duplicate registrations
DELIMITER $$
CREATE TRIGGER prevent_duplicate_registration
BEFORE INSERT ON Registrations
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM Registrations
        WHERE event_id = NEW.event_id AND user_id = NEW.user_id
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User already registered for this event!';
    END IF;
END$$

-- 2. Prevent registration for past events
CREATE TRIGGER prevent_past_event_registration
BEFORE INSERT ON registrations
FOR EACH ROW
BEGIN
    DECLARE event_date DATETIME;
    
    SELECT date INTO event_date
    FROM events 
    WHERE id = NEW.event_id;
    
    IF event_date < NOW() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot register for past events';
    END IF;
END$$

-- 3. Only allow feedback from users who attended the event
CREATE TRIGGER prevent_feedback_from_non_attendees
BEFORE INSERT ON feedbacks
FOR EACH ROW
BEGIN
    DECLARE attendance_status INT DEFAULT 0;
    
    SELECT attended INTO attendance_status
    FROM registrations 
    WHERE user_id = NEW.user_id AND event_id = NEW.event_id;
    
    IF attendance_status = 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Only users who attended the event can submit feedback';
    END IF;
END$$

-- 4. Log registration activity
CREATE TRIGGER log_registration
AFTER INSERT ON registrations
FOR EACH ROW
BEGIN
    INSERT INTO event_activity_log (event_id, user_id, action, timestamp)
    VALUES (NEW.event_id, NEW.user_id, 'REGISTERED', NOW());
END$$

-- 5. Log attendance marking
CREATE TRIGGER log_attendance
AFTER UPDATE ON registrations
FOR EACH ROW
BEGIN
    IF OLD.attended = 0 AND NEW.attended = 1 THEN
        INSERT INTO event_activity_log (event_id, user_id, action, timestamp)
        VALUES (NEW.event_id, NEW.user_id, 'ATTENDED', NOW());
    END IF;
END$$

DELIMITER ;

-- =====================================================
-- REQUIRED SUPPORTING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS event_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    action ENUM('REGISTERED', 'ATTENDED', 'FEEDBACK_SUBMITTED') NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- USEFUL VIEW FOR EVENT STATISTICS
-- =====================================================

CREATE VIEW event_statistics AS
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
GROUP BY e.id, e.title, e.date, e.location, e.category;
