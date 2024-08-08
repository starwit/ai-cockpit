INSERT INTO "trafficincidenttype" ("name")
VALUES 
    ('Stau'),
    ('Parken auf Sperrfläche'),
    ('Gefahrensituation'),
    ('Falschfahrer'),
    ('hohe Geschwindigkeit');

INSERT INTO "mitigationactiontype" ("name", "description", "executionpolicy")
VALUES 
    ('Polizei benachrichtigen', 'Polizei description', 'MANUAL'),
    ('an Verkehrsfunk melden', 'Verkehrsfunk description', 'MANUAL'),
    ('Straße Sperren', 'Sperren description', 'MANUAL'),
    ('Abschleppdienst benachrichtigen', 'Abschleppdienst description', 'MANUAL');

INSERT INTO "trafficincident" ("acquisitiontime", "trafficincidenttype_id")
VALUES 
    ('2016-01-04 10:34:23', 5),
    ('2016-01-04 10:34:23', 2),
    ('2016-01-04 10:34:23', 3),
    ('2016-01-04 10:34:23', 4),
    ('2016-01-04 10:34:23', 5),
    ('2016-01-04 10:34:23', 3),
    ('2016-01-04 10:34:23', 2);

INSERT INTO "trafficincidenttype_mitigationactiontype"(
	"trafficincidenttype_id", "mitigationactiontype_id")
	VALUES (1, 1), (1, 2);