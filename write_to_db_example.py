#!/bin/python

import pandas as pd
import numpy as np
import psycopg2
from sqlalchemy import create_engine

data=pd.read_csv("Data_Private/prepared/for_insert_inzidenzen-gemeinden-ueber-500.csv", parse_dates=True, index_col=0)

# postgresql+psycopg2://<username>:<password>@<host>/<dbname>
alchemyEngine = create_engine('postgresql+psycopg2://postgres:postgres@192.168.1.150:55432');
dbConnection = alchemyEngine.connect();
data.to_sql('gemeinde_inzidenzen', dbConnection)

