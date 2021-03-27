CREATE TABLE "entry" (
    "id" SERIAL PRIMARY KEY,
    "exercise" TEXT NOT NULL,
    "start_mood" INTEGER NOT NULL,
    "end_mood" INTEGER NOT NULL,
    "notes" TEXT,
    "date_created" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "user_id" INTEGER REFERENCES "user"(id)
        ON DELETE CASCADE NOT NULL
);