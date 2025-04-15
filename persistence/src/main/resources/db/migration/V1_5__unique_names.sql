ALTER TABLE "module"
    ADD UNIQUE ("name");

ALTER TABLE "decisiontype"
    ADD UNIQUE ("name");

ALTER TABLE "actiontype"
    ADD UNIQUE ("name");