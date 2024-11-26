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

CREATE SEQUENCE IF NOT EXISTS "mitigationaction_id_seq";

CREATE TABLE "mitigationaction"
(
    "creationtime" TIMESTAMP WITH TIME ZONE,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "decision_id" BIGINT,
    "mitigationactiontype_id" BIGINT,
    "id" BIGINT NOT NULL DEFAULT nextval('mitigationaction_id_seq'),
    CONSTRAINT "mitigationaction_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "autonomylevel_id_seq";

CREATE TABLE "autonomylevel"
(
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "id" BIGINT NOT NULL DEFAULT nextval('autonomylevel_id_seq'),
    CONSTRAINT "autonomylevel_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "decisiontype_id_seq";

CREATE TABLE "decisiontype"
(
    "id" BIGINT NOT NULL DEFAULT nextval('decisiontype_id_seq'),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    CONSTRAINT "decisiontype_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "mitigationactiontype_id_seq";

CREATE TABLE "mitigationactiontype"
(
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "executionpolicy" VARCHAR(255),
    "id" BIGINT NOT NULL DEFAULT nextval('mitigationactiontype_id_seq'),
    CONSTRAINT "mitigationactiontype_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "decision"
    ADD CONSTRAINT "fk_decision_decisiontype"
    FOREIGN KEY ("decisiontype_id")
    REFERENCES "decisiontype" ("id");

ALTER TABLE "mitigationaction"
    ADD CONSTRAINT "fk_mitigationaction_decision"
    FOREIGN KEY ("decision_id")
    REFERENCES "decision" ("id");

ALTER TABLE "mitigationaction"
    ADD CONSTRAINT "fk_mitigationaction_mitigationactiontype"
    FOREIGN KEY ("mitigationactiontype_id")
    REFERENCES "mitigationactiontype" ("id");

CREATE TABLE "decisiontype_mitigationactiontype" (
    "decisiontype_id" BIGINT NOT NULL,
    "mitigationactiontype_id" BIGINT NOT NULL,
    PRIMARY KEY ("decisiontype_id", "mitigationactiontype_id")
);

ALTER TABLE "decisiontype_mitigationactiontype"
    ADD CONSTRAINT "fk_decisiontype_mitigationactiontype"
    FOREIGN KEY ("decisiontype_id")
    REFERENCES "decisiontype" ("id");

ALTER TABLE "decisiontype_mitigationactiontype"
    ADD CONSTRAINT "fk_mitigationactiontype_mitigationactiontype"
    FOREIGN KEY ("mitigationactiontype_id")
    REFERENCES "mitigationactiontype" ("id");