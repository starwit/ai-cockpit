ALTER TABLE "actiontype"
ADD "endpoint" VARCHAR(255);

ALTER TABLE "action"
ADD "state" VARCHAR(100);

ALTER TABLE "action"
ADD "metadata" VARCHAR(500);