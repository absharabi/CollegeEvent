# Database Triggers for College Event Management System

## Overview
This document describes the database triggers implemented to maintain data integrity and business logic in the College Event Management System.

## Trigger Files
- `triggers.sql` - Complete set of triggers with all features
- `essential-triggers.sql` - Essential triggers only (recommended)
- `setup-triggers.js` - Node.js script to execute triggers

## Essential Triggers

### 1. Prevent Duplicate Registrations
**Trigger:** `prevent_duplicate_registration`
**Purpose:** Prevents users from registering for the same event multiple times
**Table:** `registrations`
**Event:** BEFORE INSERT

### 2. Prevent Past Event Registrations
**Trigger:** `prevent_past_event_registration`
**Purpose:** Prevents users from registering for events that have already occurred
**Table:** `registrations`
**Event:** BEFORE INSERT

### 3. Restrict Feedback to Attendees
**Trigger:** `prevent_feedback_from_non_attendees`
**Purpose:** Only allows users who attended an event to submit feedback
**Table:** `feedbacks`
**Event:** BEFORE INSERT

### 4. Log Registration Activity
**Trigger:** `log_registration`
**Purpose:** Logs when users register for events
**Table:** `registrations`
**Event:** AFTER INSERT

### 5. Log Attendance Activity
**Trigger:** `log_attendance`
**Purpose:** Logs when attendance is marked for events
**Table:** `registrations`
**Event:** AFTER UPDATE

## Supporting Tables

### event_activity_log
Tracks user activities related to events:
- `id` - Primary key
- `event_id` - Foreign key to events table
- `user_id` - Foreign key to users table
- `action` - Type of activity (REGISTERED, ATTENDED, FEEDBACK_SUBMITTED)
- `timestamp` - When the activity occurred

## Installation

### Method 1: Using Node.js Script (Recommended)
```bash
cd "College Event Backend"
node setup-triggers.js
```

### Method 2: Manual SQL Execution
1. Open MySQL command line or MySQL Workbench
2. Connect to your database
3. Execute the contents of `essential-triggers.sql`

## Testing the Triggers

The setup script includes automatic testing:

1. **Duplicate Registration Test**: Tries to register user 2 for event 1 again (should fail)
2. **Non-Attendee Feedback Test**: Tries to submit feedback from user who didn't attend (should fail)
3. **Valid Registration Test**: Registers user 6 for event 2 (should succeed)

## Useful Queries

### View Event Statistics
```sql
SELECT * FROM event_statistics WHERE id = 1;
```

### View Activity Log
```sql
SELECT 
    eal.*,
    u.name as user_name,
    e.title as event_title
FROM event_activity_log eal
JOIN users u ON eal.user_id = u.id
JOIN events e ON eal.event_id = e.id
ORDER BY eal.timestamp DESC;
```

### Check Registration Status
```sql
SELECT 
    r.*,
    u.name as user_name,
    e.title as event_title,
    e.date as event_date
FROM registrations r
JOIN users u ON r.user_id = u.id
JOIN events e ON r.event_id = e.id
WHERE r.attended = 1;
```

## Error Messages

The triggers will return these error messages:
- `"User is already registered for this event"` - When trying to register twice
- `"Cannot register for past events"` - When trying to register for past events
- `"Only users who attended the event can submit feedback"` - When non-attendees try to submit feedback

## Maintenance

### To Drop All Triggers
```sql
DROP TRIGGER IF EXISTS prevent_duplicate_registration;
DROP TRIGGER IF EXISTS prevent_past_event_registration;
DROP TRIGGER IF EXISTS prevent_feedback_from_non_attendees;
DROP TRIGGER IF EXISTS log_registration;
DROP TRIGGER IF EXISTS log_attendance;
```

### To Recreate Triggers
Simply run the setup script again or execute the SQL file.

## Benefits

1. **Data Integrity**: Prevents invalid data from being inserted
2. **Business Logic Enforcement**: Ensures business rules are followed at database level
3. **Audit Trail**: Tracks user activities automatically
4. **Performance**: Reduces application-level validation overhead
5. **Consistency**: Ensures rules are enforced regardless of how data is inserted

## Notes

- Triggers are executed at the database level, so they work regardless of how data is inserted (API, direct SQL, etc.)
- The activity log table will grow over time - consider implementing a cleanup strategy for old logs
- All triggers use `SIGNAL SQLSTATE '45000'` for custom error messages
- Foreign key constraints ensure data consistency when related records are deleted
