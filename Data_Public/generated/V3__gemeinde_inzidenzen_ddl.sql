create table gemeinde_inzidenzen
(
    bfs_nummer int4,
    gemeinde   varchar(256),
    datum      date,
    inzidenz   decimal(10, 2),
    PRIMARY KEY (bfs_nummer, datum)
);
