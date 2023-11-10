DROP TABLE IF EXISTS "public"."forgetten-password-emails";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS "forgetten-password-emails_id_seq";

-- Table Definition
CREATE TABLE "public"."forgetten-password-emails" (
    "id" int4 NOT NULL DEFAULT nextval('"forgetten-password-emails_id_seq"'::regclass),
    "email" varchar NOT NULL,
    "passwordToken" varchar NOT NULL,
    "timestamp" timestamp NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."profile";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS profile_id_seq;
DROP TYPE IF EXISTS "public"."profile_gender_enum";
CREATE TYPE "public"."profile_gender_enum" AS ENUM ('Male', 'Female');
DROP TYPE IF EXISTS "public"."profile_department_enum";
CREATE TYPE "public"."profile_department_enum" AS ENUM ('CS', 'IT', 'DS', 'IS');

-- Table Definition
CREATE TABLE "public"."profile" (
    "id" int4 NOT NULL DEFAULT nextval('profile_id_seq'::regclass),
    "firstName" varchar NOT NULL,
    "lastName" varchar NOT NULL,
    "gender" "public"."profile_gender_enum" NOT NULL,
    "department" "public"."profile_department_enum" NOT NULL,
    "level" int4 NOT NULL,
    "image" varchar,
    "phone" varchar NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."team";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS team_id_seq;
DROP TYPE IF EXISTS "public"."team_department_enum";
CREATE TYPE "public"."team_department_enum" AS ENUM ('CS', 'IT', 'DS', 'IS');

-- Table Definition
CREATE TABLE "public"."team" (
    "id" int4 NOT NULL DEFAULT nextval('team_id_seq'::regclass),
    "name" varchar NOT NULL,
    "department" "public"."team_department_enum" NOT NULL,
    "image" varchar,
    "leaderId" int4 NOT NULL,
    CONSTRAINT "FK_eb6525b7fe24a9b847dccf6a129" FOREIGN KEY ("leaderId") REFERENCES "public"."users"("id"),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."user_join_team";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS user_join_team_id_seq;
DROP TYPE IF EXISTS "public"."user_join_team_type_enum";
CREATE TYPE "public"."user_join_team_type_enum" AS ENUM ('TEAM', 'STUDENT');

-- Table Definition
CREATE TABLE "public"."user_join_team" (
    "id" int4 NOT NULL DEFAULT nextval('user_join_team_id_seq'::regclass),
    "type" "public"."user_join_team_type_enum" NOT NULL,
    "createdAt" timestamp NOT NULL DEFAULT now(),
    "userId" int4 NOT NULL,
    "teamId" int4 NOT NULL,
    CONSTRAINT "FK_fba6f4fde364f2340a7250a975e" FOREIGN KEY ("userId") REFERENCES "public"."users"("id"),
    CONSTRAINT "FK_66602bf746676245f1f25e7902c" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id"),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."users";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "password" varchar NOT NULL,
    "email" varchar NOT NULL,
    "salt" varchar NOT NULL,
    "username" varchar NOT NULL,
    "roles" _users_roles_enum NOT NULL,
    "verifiedAt" date,
    "profileId" int4 NOT NULL,
    "teamId" int4,
    CONSTRAINT "FK_b1bda35cdb9a2c1b777f5541d87" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id"),
    CONSTRAINT "FK_d1803064187c8f38e57a9c4984c" FOREIGN KEY ("teamId") REFERENCES "public"."team"("id") ON DELETE SET NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."verified-emails";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS "verified-emails_id_seq";

-- Table Definition
CREATE TABLE "public"."verified-emails" (
    "id" int4 NOT NULL DEFAULT nextval('"verified-emails_id_seq"'::regclass),
    "email" varchar NOT NULL,
    "emailToken" varchar NOT NULL,
    "timestamp" timestamp NOT NULL,
    PRIMARY KEY ("id")
);



INSERT INTO "public"."profile" ("id", "firstName", "lastName", "gender", "department", "level", "image", "phone") VALUES
(8, 'Hyatt', 'Knowles', 'Male', 'IT', 4, NULL, '01205875831');
INSERT INTO "public"."profile" ("id", "firstName", "lastName", "gender", "department", "level", "image", "phone") VALUES
(9, 'b', 'b', 'Male', 'IS', 3, NULL, '01205875832');


INSERT INTO "public"."team" ("id", "name", "department", "image", "leaderId") VALUES
(9, 'Team1', 'IS', NULL, 9);




INSERT INTO "public"."users" ("id", "password", "email", "salt", "username", "roles", "verifiedAt", "profileId", "teamId") VALUES
(9, '$2b$08$QRTrAH7q7ZKc1XXi8L7W/OCOuK7YHdalUZBMfr4iq0iZKfGFhTAHy', 'b@b.com', '$2b$08$QRTrAH7q7ZKc1XXi8L7W/O', 'b', '{STUDENT,LEADER}', NULL, 9, 9);
INSERT INTO "public"."users" ("id", "password", "email", "salt", "username", "roles", "verifiedAt", "profileId", "teamId") VALUES
(8, '$2b$08$RpEynxRHuP2O4AjGPVhOOeduEqKAGSm/6W96b2jfIUKmPQ1vuE4f6', 'a@a.com', '$2b$08$RpEynxRHuP2O4AjGPVhOOe', 'pewys', '{STUDENT}', NULL, 8, 9);



