ALTER TABLE "module"
    ADD "version" VARCHAR(255);

ALTER TABLE "module"
    ADD "application_identifier" VARCHAR(255);

ALTER TABLE "module"
    ADD "use_ai" BOOLEAN DEFAULT FALSE;

ALTER TABLE "module"
    ADD "model_name" VARCHAR(255);

ALTER TABLE "module"
    ADD "model_type" VARCHAR(255);

ALTER TABLE "module"
    ADD "model_version" VARCHAR(20);

ALTER TABLE "module"
    ADD "last_deployment" TIMESTAMP WITH TIME ZONE;

ALTER TABLE "module"
    ADD "model_link" VARCHAR(255);

ALTER TABLE "module"
    ADD "public_training_data" BOOLEAN DEFAULT FALSE;

ALTER TABLE "module"
    ADD "link_to_public_training_data" VARCHAR(255);

ALTER TABLE "module"
    ADD "sbom_locations" TEXT;

COMMIT;

CREATE TABLE module_successors 
(
    "predecessor_id" BIGINT NOT NULL,
    "successor_id" BIGINT NOT NULL,
    PRIMARY KEY ("predecessor_id", "successor_id"),
    FOREIGN KEY ("predecessor_id") REFERENCES "module"("id") ON DELETE CASCADE,
    FOREIGN KEY ("successor_id") REFERENCES "module"("id") ON DELETE CASCADE
);