#!/bin/python

import pandas as pd
import numpy as np

def clean_inzidenzen_gemeinden_ueber_500():
    data=pd.read_csv("Data_Private/raw/C25/Inzidenzen Gemeinden über 500.csv", sep=";",
                 encoding='Latin1',
                 parse_dates=True, index_col=0)
    data = data.transpose()
    data.to_csv('Data_Private/prepared/cleaned_inzidenzen-gemeinden-ueber-500.csv')
    # cleaned=pd.read_csv("cleaned_inzidenzen-gemeinden-ueber-500.csv",parse_dates=True, index_col=0)
    return data

def create_for_insert_statements_inzidenzen_gemeinden_ueber_500():
    data = clean_inzidenzen_gemeinden_ueber_500()
    dataframes = list()
    for col in data.columns:
        col_data = pd.DataFrame(data[col])
        col_data['Gemeinde'] = col
        col_data['Inzidenz'] = col_data[col]
        col_data = col_data[['Inzidenz', 'Gemeinde']]
        dataframes.append(col_data)

    df = pd.concat(dataframes).dropna()
    df.to_csv('for_insert_inzidenzen-gemeinden-ueber-500.csv')
    
def clean_vacme_ueber_500():
    data=pd.read_csv("Data_Private/raw/C25/VacMe - Gemeinden über 500.csv", sep=";",
                 encoding='Latin1',
                 parse_dates=True, index_col=0)
    # Remove unnamed cols
    data = data[[c for c in data.columns if not "Unnamed" in c]]
    data.to_csv('Data_Private/prepared/cleaned_VacMe_Gemeinden_ueber_500.csv')

def clean_vacme_inkl_altersgruppen():
    data=pd.read_csv("Data_Private/raw/C25/VacMe - Gemeinden inkl Altersgruppen über 250.csv", sep=";",
                 encoding='Latin1',
                 parse_dates=True, index_col=0)
    # Remove unnamed cols
    data = data[[c for c in data.columns if not "Unnamed" in c]]
    data.to_csv('Data_Private/prepared/cleaned_VacMe_Gemeinden_inkl_Altersgruppen_250.csv')

def clean_lieferungen():
    webshop = pd.read_excel('Data_Private/raw/C25/Webshop Lieferungen.xlsx', index_col=0)
    webshop.to_csv('Data_Private/prepared/cleaned_Webshop_Lieferungen.csv')
    webformular = pd.read_excel('Data_Private/raw/C25/Webformular Lieferungen.xlsx', index_col=0)
    webformular.to_csv('Data_Private/prepared/cleaned_Webformular_Lieferungen.csv')
    lieferungen = pd.concat([webshop, webformular])
    lieferungen.to_csv('Data_Private/prepared/cleaned_alle_Lieferungen.csv')

def clean_maileingaenge():
    data = pd.read_excel('Data_Private/raw/C31/Maileingänge.xlsx', index_col=0)
    # Remove unnamed cols
    data = data[[c for c in data.columns if not "Unnamed" in c]]
    data.to_csv('Data_Private/prepared/cleaned_Maileingaenge.csv')
    
create_for_insert_statements_inzidenzen_gemeinden_ueber_500()
clean_vacme_ueber_500()
clean_vacme_inkl_altersgruppen()
clean_lieferungen()
clean_maileingaenge()