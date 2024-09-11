INSERT INTO "trafficincidenttype" ("name", "description")
VALUES 
    ('dangerous driving behaviour', 'A road user involving reckless or unsafe driving behavior'),
    ('accident', 'A traffic incident involving a collision or crash between vehicles or other obstacles'),
    ('traffic jam', 'A situation where traffic is congested and vehicles are moving slowly or not at all');


INSERT INTO "mitigationactiontype" ("name", "description", "executionpolicy")
VALUES 
    ('notify police', 'Notify the police about the traffic incident', 'WITHCHECK'),
    ('notify emergency services', 'Notify emergency services like ambulances or fire departments', 'MANUAL'),
    ('notify public platform', 'Notify public platforms or apps about the traffic incident', 'AUTOMATIC');

INSERT INTO "trafficincident" ("acquisitiontime", "trafficincidenttype_id")
VALUES 
    ('2016-01-04 10:34:23', 1),
    ('2016-01-04 11:34:23', 2),
    ('2016-01-04 12:34:23', 3),
    ('2016-01-04 10:34:23', 1),
    ('2016-01-04 10:34:23', 2),
    ('2016-01-04 10:34:23', 3),
    ('2016-01-04 10:34:23', 2);

INSERT INTO "trafficincidenttype_mitigationactiontype"(
	"trafficincidenttype_id", "mitigationactiontype_id")
	VALUES 
    (1, 1),
    (2, 1),
    (2, 2),
    (2, 3),
    (3, 1), 
    (3, 3);
