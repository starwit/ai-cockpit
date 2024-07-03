INSERT INTO "trafficincidenttype" ("name")
VALUES 
    ('Stau'),
    ('Parken auf Sperrfläche'),
    ('Gefahrensituation'),
    ('Falschfahrer'),
    ('hohe Geschwindigkeit');

INSERT INTO "mitigationactiontype" ("name", "description")
VALUES 
    ('Polizei benachrichtigen', 'Polizei description'),
    ('an Verkehrsfunk melden', 'Verkehrsfunk description'),
    ('Straße Sperren', 'Sperren description'),
    ('Abschleppdienst benachrichtigen', 'Abschleppdienst description');

INSERT INTO "trafficincident" ("acquisitiontime", "trafficincidenttype_id")
VALUES 
    ('2016-01-04 10:34:23', 5),
    ('2016-01-04 10:34:23', 2),
    ('2016-01-04 10:34:23', 3),
    ('2016-01-04 10:34:23', 4),
    ('2016-01-04 10:34:23', 5),
    ('2016-01-04 10:34:23', 3),
    ('2016-01-04 10:34:23', 2);
