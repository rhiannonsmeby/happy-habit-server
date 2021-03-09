BEGIN;

TRUNCATE
    user,
    activity,
    mood_log
    RESTART IDENTITY CASCADE;

INSERT INTO user (name, username, email, password) 
VALUES
('Demo User', 'demo_user', 'demo@gmail.com', 'password1'),
('Harrison Baty', 'harrisonb', 'harris@gmail.com', 'password2'),
('Sarah', 'thebirdspapaya', 'thebirdspapaya@biz.com', 'password3');

INSERT INTO activity (assigned_user, activity_name)
VALUES
(1, 'Journal'),
(1, 'Go for a walk'),
(1, 'Cook a nutritious meal'),
(2, 'Have a snack'),
(3, 'Watch an episode of my favorite TV show'),
(3, 'Take a shower');

INSERT INTO mood_log (assigned_user, assigned_activity, start_mood, end_mood, notes)
(1, 1, 1, 3, 'Today I used a journal propmt about gratitude. I finished about 20 minutes of journaling feeling much better.'),
(2, 4, 1, 2, 'Not the major mood boost I was looking for'),
(3, 5, 2, 4),
(3, 6, 2, 5, 'Sometimes when I think I am sad, I am really just dirty haha');

COMMIT;