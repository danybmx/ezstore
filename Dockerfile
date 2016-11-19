FROM jboss/wildfly:latest

# Create an admin user
RUN /opt/jboss/wildfly/bin/add-user.sh admin admin --silent

# Setup environment
ADD environment /opt/jboss/wildfly/environment

CMD ["/opt/jboss/wildfly/environment/setup.sh"]
