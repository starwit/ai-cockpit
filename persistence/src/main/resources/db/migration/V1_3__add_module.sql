CREATE SEQUENCE IF NOT EXISTS "module_id_seq";

CREATE TABLE "module"
(
    "id" BIGINT NOT NULL DEFAULT nextval('module_id_seq'),
    "name" VARCHAR(255),
    "description" VARCHAR(255),
    "decisiontype_id" BIGINT,
    "decision_id" BIGINT,
    "actiontype_id" BIGINT,
    CONSTRAINT "module_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "decisiontype"
    ADD "module_id" BIGINT;

ALTER TABLE "decisiontype"
    ADD CONSTRAINT "fk_module_decisiontype"
    FOREIGN KEY ("module_id")
    REFERENCES "module" ("id");

ALTER TABLE "decision"
    ADD "module_id" BIGINT;

ALTER TABLE "decision"
    ADD CONSTRAINT "fk_module_decision"
    FOREIGN KEY ("module_id")
    REFERENCES "module" ("id");

ALTER TABLE "actiontype"
    ADD "module_id" BIGINT;

ALTER TABLE "actiontype"
    ADD CONSTRAINT "fk_module_actiontype"
    FOREIGN KEY ("module_id")
    REFERENCES "module" ("id");
