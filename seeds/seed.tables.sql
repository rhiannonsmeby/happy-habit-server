BEGIN;

TRUNCATE
    users,
    -- activities,
    entries
    RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, password) 
VALUES
('demo_user', 'password1'),
('harrisonb', 'password2'),
('thebirdspapaya', 'password3');

-- INSERT INTO activities (assigned_user, activity_name)
-- VALUES
-- (1, 'Journal'),
-- (1, 'Go for a walk'),
-- (1, 'Cook a nutritious meal'),
-- (2, 'Have a snack'),
-- (3, 'Watch an episode of my favorite TV show'),
-- (3, 'Take a shower');

INSERT INTO entries (assigned_user, exercise, start_mood, end_mood, notes)
VALUES
(1, 'journal', 1, 3, 'Today I used a journal propmt about gratitude. I finished about 20 minutes of journaling feeling much better.'),
(2, 'go for a walk', 1, 2, 'Not the major mood boost I was looking for'),
(3, 'yoga', 2, 4, ''),
(3, 'cook a nutritious meal', 2, 5, 'Sometimes when I think I am sad, I am really just dirty haha');

COMMIT;