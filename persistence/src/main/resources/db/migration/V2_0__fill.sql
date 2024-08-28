INSERT INTO "trafficincidenttype" ("name", "description")
VALUES 
    ('dangerous driving behaviour', 'A road user involving reckless or unsafe driving behavior'),
    ('accident', 'A traffic incident involving a collision or crash between vehicles or other obstacles'),
    ('traffic jam', 'A situation where traffic is congested and vehicles are moving slowly or not at all'),
    ('Stau', NULL),
    ('Parken auf Sperrfläche', NULL),
    ('Gefahrensituation', NULL),
    ('Falschfahrer', NULL),
    ('hohe Geschwindigkeit', NULL);

INSERT INTO "mitigationactiontype" ("name", "description", "executionpolicy")
VALUES 
    ('notify police', 'Notify the police about the traffic incident', 'WITHCHECK'),
    ('notify emergency services', 'Notify emergency services like ambulances or fire departments', 'DISABLED'),
    ('notify public platform', 'Notify public platforms or apps about the traffic incident', 'MANUAL'),
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
	VALUES 
    (1, 1),
    (2, 1),
    (2, 3),
    (3, 3),
    (4, 4), 
    (4, 5);