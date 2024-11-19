INSERT INTO "trafficincidenttype" ("name", "description")
VALUES 
    ('dangerous driving behaviour','A road user involving reckless or unsafe driving behavior'),
    ('accident','A traffic incident involving a collision or crash between vehicles or other obstacles'),
    ('traffic jam','A situation where traffic is congested and vehicles are moving slowly or not at all'),
    ('disabled vehicle','A vehicle is blocking traffic'),
    ('helpless person','A human in need of assistance'),
    ('first responder ops','First responders operating in an area');

INSERT INTO "mitigationactiontype" ("name", "description", "executionpolicy")
VALUES 
    ('notify police', 'Notify the police about the traffic incident', 'WITHCHECK'),
    ('notify emergency services', 'Notify emergency services like ambulances or fire departments', 'MANUAL'),
    ('notify public alarm services', 'Notify public platforms or apps about the traffic incident', 'AUTOMATIC'),
    ('I2X notification', 'Issue an infrastructure to X message', 'WITHCHECK'),
    ('notify towing service', 'Get disabled vehicles or obstacles removed', 'AUTOMATIC');

INSERT INTO "trafficincidenttype_mitigationactiontype"("trafficincidenttype_id", "mitigationactiontype_id")
VALUES 
    (1,1),
    (1,4),
    (2,1),
    (2,2),
    (2,3),
    (2,5),
    (3,1),
    (3,3),
    (3,4),
    (4,1),
    (4,4),
    (4,5),
    (5,1),
    (5,2),
    (5,3),
    (6,3),
    (6,4);