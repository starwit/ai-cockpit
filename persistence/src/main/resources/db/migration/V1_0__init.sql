CREATE SEQUENCE IF NOT EXISTS "decision_id_seq";

CREATE TABLE "decision"
(
    "acquisitiontime" TIMESTAMP WITH TIME ZONE,
    "decisiontype_id" BIGINT,
    "mediaurl" VARCHAR(500),
    "cameralatitude" DECIMAL(22,19),
    "cameralongitude" DECIMAL(22,19),
    "state" VARCHAR(255),
    "description" VARCHAR(255),
    "id" BIGINT NOT NULL DEFAULT nextval('decision_id_seq'),
    CONSTRAINT "decision_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "action_id_seq";

CREATE TABLE "action"
(
    "creationtime" TIMESTAMP WITH TIME ZONE,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "decision_id" BIGINT,
    "actiontype_id" BIGINT,
    "id" BIGINT NOT NULL DEFAULT nextval('action_id_seq'),
    CONSTRAINT "action_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "decisiontype_id_seq";

CREATE TABLE "decisiontype"
(
    "id" BIGINT NOT NULL DEFAULT nextval('decisiontype_id_seq'),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    CONSTRAINT "decisiontype_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "actiontype_id_seq";

CREATE TABLE "actiontype"
(
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "executionpolicy" VARCHAR(255),
    "id" BIGINT NOT NULL DEFAULT nextval('actiontype_id_seq'),
    CONSTRAINT "actiontype_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "decision"
    ADD CONSTRAINT "fk_decision_decisiontype"
    FOREIGN KEY ("decisiontype_id")
    REFERENCES "decisiontype" ("id");

ALTER TABLE "action"
    ADD CONSTRAINT "fk_action_decision"
    FOREIGN KEY ("decision_id")
    REFERENCES "decision" ("id");

ALTER TABLE "action"
    ADD CONSTRAINT "fk_action_actiontype"
    FOREIGN KEY ("actiontype_id")
    REFERENCES "actiontype" ("id");

CREATE TABLE "decisiontype_actiontype" (
    "decisiontype_id" BIGINT NOT NULL,
    "actiontype_id" BIGINT NOT NULL,
    PRIMARY KEY ("decisiontype_id", "actiontype_id")
);

ALTER TABLE "decisiontype_actiontype"
    ADD CONSTRAINT "fk_decisiontype_actiontype"
    FOREIGN KEY ("decisiontype_id")
    REFERENCES "decisiontype" ("id");

ALTER TABLE "decisiontype_actiontype"
    ADD CONSTRAINT "fk_actiontype_actiontype"
    FOREIGN KEY ("actiontype_id")
    REFERENCES "actiontype" ("id");