FROM ubuntu:18.04

ARG CE_VERSION=7.4.3.92-ga92
ARG CE_TIMESTAMP=20230831132112456
ARG TOMCAT=9.0.75

ENV LIFERAY_HOME=/opt/liferay-ce-portal-${CE_VERSION}
ENV LIFERAY_SHARED=/storage/liferay
ENV LIFERAY_CONFIG_DIR=/opt/liferay/configs
ENV LIFERAY_DEPLOY_DIR=/opt/liferay/deploy
ENV CATALINA_HOME=$LIFERAY_HOME/tomcat-${TOMCAT}
ENV PATH=$CATALINA_HOME/bin:$PATH
ENV LIFERAY_TOMCAT_URL=https://github.com/liferay/liferay-portal/releases/download/${CE_VERSION}/liferay-ce-portal-tomcat-${CE_VERSION}-${CE_TIMESTAMP}.tar.gz
ENV GOSU_VERSION 1.10
ENV GOSU_URL=https://github.com/tianon/gosu/releases/download/$GOSU_VERSION

# Install dependencies
RUN apt-get update && \
   apt-get -y install \
       curl \
       wget \
       telnet \
       tar \
       vim \
       unzip \
       openjdk-8-jdk \
       net-tools \
       procps \
       gnupg \
       tree \
       mysql-client \
       sudo

ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64

# Create liferay:liferay user and group.  All base images will run as this user .
RUN groupadd --gid 6000 liferay && \
   useradd -g liferay --create-home --uid 6000 liferay

RUN cd /opt && \
   set -x && \
   curl -fSL "$LIFERAY_TOMCAT_URL" -o liferay-ce-portal-tomcat.tar.gz && \
   gunzip liferay-ce-portal-tomcat.tar.gz && \
   tar -xf liferay-ce-portal-tomcat.tar && \
   rm liferay-ce-portal-tomcat.tar && \
   ln -s liferay-ce-portal-${CE_VERSION} liferay && \
   chown -R liferay:liferay $LIFERAY_HOME && \
   cd liferay && \
   ln -s tomcat-${TOMCAT} tomcat && \
   ln -s /opt/liferay/deploy /mnt/deploy && \
   wget -O /usr/local/bin/gosu "$GOSU_URL/gosu-$(dpkg --print-architecture)" && \
   wget -O /usr/local/bin/gosu.asc "$GOSU_URL/gosu-$(dpkg --print-architecture).asc" && \
   export GNUPGHOME="$(mktemp -d)" && \
   rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc && \
   chmod +x /usr/local/bin/gosu && \
   gosu nobody true
#    gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 && \
#    gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu && \

COPY ./configs $LIFERAY_CONFIG_DIR/.
COPY ./entrypoint.sh /usr/local/bin
COPY ./ojdbc8.jar $CATALINA_HOME/lib
COPY ./configs/ROOT.xml $CATALINA_HOME/conf/Catalina/localhost/ROOT.xml
RUN chmod +x /usr/local/bin/entrypoint.sh
RUN chmod +x $CATALINA_HOME/bin/catalina.sh

EXPOSE 8080/tcp
EXPOSE 9000/tcp
EXPOSE 11311/tcp

VOLUME ["/mnt/deploy", "/storage", "/tmp"]

ENTRYPOINT ["entrypoint.sh"]
CMD ["catalina.sh", "run"]
