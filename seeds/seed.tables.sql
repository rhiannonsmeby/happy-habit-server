BEGIN;

TRUNCATE
    "user",
    "entry"
    RESTART IDENTITY CASCADE;

INSERT INTO "user" ("username", "password", "name") 
VALUES
('demouser', 'Password1!', 'Demo Person'),
('harrisonb', 'Password2!', 'Harrison'),
('thebirdspapaya', 'Password3!', 'Sarah');

INSERT INTO "entry" ("exercise", "start_mood", "end_mood", "notes", "user_id")
VALUES
('journal', 1, 3, 'Today I used a journal propmt about gratitude. I finished about 20 minutes of journaling feeling much better.', 1),
('go for a walk', 1, 2, 'Not the major mood boost I was looking for', 2),
('yoga', 2, 4, 'nothing needs to be here', 3),
('cook a nutritious meal', 2, 5, 'Sometimes when I think I am sad, I am really just dirty haha', 1);

COMMIT;