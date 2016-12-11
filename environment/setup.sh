#!/bin/bash

JBOSS_HOME=/opt/jboss/wildfly
JBOSS_CLI=$JBOSS_HOME/bin/jboss-cli.sh
JBOSS_MODE=${1:-"standalone"}
JBOSS_CONFIG=${2:-"$JBOSS_MODE.xml"}

function waitForServer() {
	until `$JBOSS_CLI -c ":read-attribute(name=server-state)" 2> /dev/null | grep -q running`; do
		sleep 1
	done
}

echo "=> Starting WildFly server"
$JBOSS_HOME/bin/$JBOSS_MODE.sh -b 0.0.0.0 -c $JBOSS_CONFIG &

echo "=> Waiting for the server to boot"
waitForServer

echo "=> Executing the environment setup"
$JBOSS_CLI -c << EOF
batch

# Add MySQL module
module add --name=com.mysql --resources=/opt/jboss/wildfly/environment/mysql-connector-java-5.1.40-bin.jar --dependencies=javax.api,javax.transaction.api

# Add MySQL driver
/subsystem=datasources/jdbc-driver=mysql:add(driver-name=mysql,driver-module-name=com.mysql,driver-xa-datasource-class-name=com.mysql.jdbc.jdbc2.optional.MysqlXADataSource)

# Add the datasource
data-source add --name=$DATASTORE_NAME --driver-name=mysql --jndi-name=java:/$DATASTORE_NAME --connection-url=$DATASTORE_URL?useSSL=false --user-name=$DATASTORE_USER --password=$DATASTORE_PASS --use-ccm=false --max-pool-size=25 --blocking-timeout-wait-millis=5000 --enabled=true

# Set undertow
/subsystem=undertow/configuration=handler/file=StaticDirHandler/:add(cache-buffer-size=1024,cache-buffers=1024,directory-listing=false,follow-symlink=true,path=/data/media)
/subsystem=undertow/server=default-server/host=default-host/location=\/static/:add(handler=StaticDirHandler)

# Execute the batch
run-batch

EOF

echo "=> Shutting down WildFly"
if [ "$JBOSS_MODE" = "standalone" ]; then
	$JBOSS_CLI -c ":shutdown"
else
	$JBOSS_CLI -c "/host=*:shutdown"
fi

echo "=> Restarting WildFly"
$JBOSS_HOME/bin/$JBOSS_MODE.sh -b 0.0.0.0 -bmanagement 0.0.0.0 -c $JBOSS_CONFIG
