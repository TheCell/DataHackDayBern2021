#!/bin/bash

docker run --name postgis -p 55432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -d postgis/postgis

# If it already exists, just use docker start -a postgis
