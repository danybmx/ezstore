FROM jboss/wildfly:latest

# Create an admin user
RUN /opt/jboss/wildfly/bin/add-user.sh admin admin --silent

# Create media folder
USER root
RUN mkdir -p /data/media
RUN chmod a+rw /data/media

# Setup environment
USER jboss
ADD environment /opt/jboss/wildfly/environment

CMD ["/opt/jboss/wildfly/environment/setup.sh"]
