create table gemeinde_impfungen
(
    registration              Date,
    geschlecht                varchar(256),
    vollstaendiger_impfschutz varchar(256),
    imfgruppe                 varchar(256),
    wohngemeinde              varchar(256),
    erstimpfung_odi_typ       varchar(256),
    erstimpfung_gemeinde      varchar(256),
    erstimpfung               Date,
    zweitimpfung_odi_typ      varchar(256),
    zweitimpfung_gemeinde     varchar(256),
    zweitimpfung              Date
);
