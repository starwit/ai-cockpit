CREATE SEQUENCE IF NOT EXISTS "trafficincident_id_seq";

CREATE TABLE "trafficincident"
(
    "acquisitiontime" TIMESTAMP WITH TIME ZONE,
    "trafficincidenttype_id" BIGINT,
    "mediaurl" VARCHAR(500),
    "cameralatitude" DECIMAL(22,19),
    "cameralongitude" DECIMAL(22,19),
    "state" VARCHAR(255),
    "description" VARCHAR(255),
    "id" BIGINT NOT NULL DEFAULT nextval('trafficincident_id_seq'),
    CONSTRAINT "trafficincident_pkey" PRIMARY KEY ("id")
);

CREATE SEQUENCE IF NOT EXISTS "mitigationaction_id_seq";

CREATE TABLE "mitigationaction"
(
    "creationtime" TIMESTAMP WITH TIME ZONE,
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "trafficincident_id" BIGINT,
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

CREATE SEQUENCE IF NOT EXISTS "trafficincidenttype_id_seq";

CREATE TABLE "trafficincidenttype"
(
    "id" BIGINT NOT NULL DEFAULT nextval('trafficincidenttype_id_seq'),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    CONSTRAINT "trafficincidenttype_pkey" PRIMARY KEY ("id")
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

ALTER TABLE "trafficincident"
    ADD CONSTRAINT "fk_trafficincident_trafficincidenttype"
    FOREIGN KEY ("trafficincidenttype_id")
    REFERENCES "trafficincidenttype" ("id");

ALTER TABLE "mitigationaction"
    ADD CONSTRAINT "fk_mitigationaction_trafficincident"
    FOREIGN KEY ("trafficincident_id")
    REFERENCES "trafficincident" ("id");

ALTER TABLE "mitigationaction"
    ADD CONSTRAINT "fk_mitigationaction_mitigationactiontype"
    FOREIGN KEY ("mitigationactiontype_id")
    REFERENCES "mitigationactiontype" ("id");

CREATE TABLE "trafficincidenttype_mitigationactiontype" (
    "trafficincidenttype_id" BIGINT NOT NULL,
    "mitigationactiontype_id" BIGINT NOT NULL,
    PRIMARY KEY ("trafficincidenttype_id", "mitigationactiontype_id")
);

ALTER TABLE "trafficincidenttype_mitigationactiontype"
    ADD CONSTRAINT "fk_trafficincidenttype_mitigationactiontype"
    FOREIGN KEY ("trafficincidenttype_id")
    REFERENCES "trafficincidenttype" ("id");

ALTER TABLE "trafficincidenttype_mitigationactiontype"
    ADD CONSTRAINT "fk_mitigationactiontype_mitigationactiontype"
    FOREIGN KEY ("mitigationactiontype_id")
    REFERENCES "mitigationactiontype" ("id");