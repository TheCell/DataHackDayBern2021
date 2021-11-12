create table gemeinde_portrait(
                                  bfs_nummer	int4 NOT NULL,
                                  gemeinde_name	varchar(255),
                                  bevoelkerung_einwohner	decimal(10,2),
                                  bevoelkerung_veraenderung	decimal(10,2),
                                  bevoelkerung_bevoelkerungsdichte	decimal(10,2),
                                  bevoelkerung_auslaender	decimal(10,2),
                                  altersverteilung_0_19	decimal(10,2),
                                  altersverteilung_20_64	decimal(10,2),
                                  altersverteilung_65	decimal(10,2),
                                  bevoelkerungsbewegung_heiratsziffer	decimal(10,2),
                                  bevoelkerungsbewegung_scheidungsziffer	decimal(10,2),
                                  bevoelkerungsbewegung_geburtziffer	decimal(10,2),
                                  bevoelkerungsbewegung_sterbeziffer	decimal(10,2),
                                  haushalt_anzahl_privathaushalte	decimal(10,2),
                                  haushalt_haushaltsgroesse_pro_person	decimal(10,2),
                                  flaeche_gesamt	decimal(10,2),
                                  flaeche_siedlung	decimal(10,2),
                                  flaeche_veraenderung	decimal(10,2),
                                  flaeche_landwirtschaft	decimal(10,2),
                                  flaeche_veraenderung_1	decimal(10,2),
                                  flaeche_wald	decimal(10,2),
                                  flaeche_unproduktiv	decimal(10,2),
                                  wirtschaft_beschaeftigte	decimal(10,2),
                                  wirtschaft_beschaeftigte_1_sektor	decimal(10,2),
                                  wirtschaft_beschaeftigte_2_sektor	decimal(10,2),
                                  wirtschaft_beschaeftigte_3_sektor	decimal(10,2),
                                  wirtschaft_arbeitsstaetten	decimal(10,2),
                                  wirtschaft_arbeitsstaetten_1_sektor	decimal(10,2),
                                  wirtschaft_arbeitsstaetten_2_sektor	decimal(10,2),
                                  wirtschaft_arbeitsstaetten_3_sektor	decimal(10,2),
                                  bau_leerwohnungsziffer	decimal(10,2),
                                  bau_neu_gebaute_wohnungen	decimal(10,2),
                                  sozialhilfequote	decimal(10,2),
                                  wahl_fdp	decimal(10,2),
                                  wahl_cvp	decimal(10,2),
                                  wahl_sp	decimal(10,2),
                                  wahl_svp	decimal(10,2),
                                  wahl_evp_csp	decimal(10,2),
                                  wahl_glp	decimal(10,2),
                                  wahl_bdp	decimal(10,2),
                                  wahl_pda_sol	decimal(10,2),
                                  wahl_gps	decimal(10,2),
                                  wahl_rechtsparteien	decimal(10,2),
                                  PRIMARY KEY (bfs_nummer)
)
