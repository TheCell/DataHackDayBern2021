FROM grafana/grafana:8.0.5
#Hilfs-Plugin, um CSV Files als DataSource verwenden zu können
RUN grafana-cli plugins install marcusolsson-csv-datasource

#bedag-swisstopo
COPY ./dist /var/lib/grafana/plugins/bedag-swisstopo


#Workaround for Grafana 8.0.5
#https://github.com/grafana/grafana/issues/36563
USER root
#bedag-swisstopo
RUN find /var/lib/grafana/plugins/bedag-swisstopo/ -type f -exec chmod -x {} +
