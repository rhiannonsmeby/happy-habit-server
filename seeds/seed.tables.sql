BEGIN;

TRUNCATE
    "user",
    -- activities,
    "entry"
    RESTART IDENTITY CASCADE;

INSERT INTO "user" (username, password, name) 
VALUES
('demo_user', 'Password1!', 'Demo Person'),
('harrisonb', 'Password2!', 'Harrison'),
('thebirdspapaya', 'Password3!', 'Sarah');

-- INSERT INTO activities (assigned_user, activity_name)
-- VALUES
-- (1, 'Journal'),
-- (1, 'Go for a walk'),
-- (1, 'Cook a nutritious meal'),
-- (2, 'Have a snack'),
-- (3, 'Watch an episode of my favorite TV show'),
-- (3, 'Take a shower');

INSERT INTO "entry" (exercise, start_mood, end_mood, notes)
VALUES
('journal', 1, 3, 'Today I used a journal propmt about gratitude. I finished about 20 minutes of journaling feeling much better.'),
('go for a walk', 1, 2, 'Not the major mood boost I was looking for'),
('yoga', 2, 4, 'nothing needs to be here'),
('cook a nutritious meal', 2, 5, 'Sometimes when I think I am sad, I am really just dirty haha');

COMMIT;