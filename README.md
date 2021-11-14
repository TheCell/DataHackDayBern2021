# DataHackDayBern2021

Dataanalyse zur Impfwilligkeit im Kanton Bern

<img src="https://raw.githubusercontent.com/TheCell/DataHackDayBern2021/main/media/distanz_wohngemeinde_impfgemeinde.gif" height="300" alt="timeline" />

## political party analysis
For the analysis with the political parties, run impfzentren.ipynb.
In cell 14, set independent_var and independent_pretty to the party you want to run the regression with.
E.g. for SP set
```
independent_var = 'wahl_sp'
independent_pretty = 'SP'
```
Where independent_var is one of the values from column_list in cell 13.

NB. Theoretically you can take any value from column_list and run a linear regression with it.
