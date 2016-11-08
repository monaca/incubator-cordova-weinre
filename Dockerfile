From library/debian:wheezy

 Use bash instead of sh
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Initial setup
RUN apt-get update
RUN apt-get -y install ant curl git python zip

# Install NVM

ENV NVM_VERSION 0.31.4
ENV NVM_DIR /usr/local/nvm/v$NVM_VERSION
ENV NODE_VERSION 0.10.47

# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v$NVM_VERSION/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

# Copy Weinre source
RUN mkdir -p /data/
WORKDIR /data
COPY . /data/
EXPOSE 8080

## Add personal.properties
RUN echo "BUILDER: Monaca \n\SERVER_URL: https://debug.monaca.mobi" > /data/weinre.build/personal.properties

# Build
RUN cd /data/weinre.build && ant build-archives

ENTRYPOINT find /data; node /data/weinre.server/weinre --boundHost -all- --sslKey /data/ssl/ssl.key --sslCert /data/ssl/ssl.cer

