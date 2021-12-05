#!/bin/bash

# Script for setting up an ubuntu server for UDP connections
# PORTS
# Protocol	Port range	    Source
# UDP	    1024 - 65535	0.0.0.0/0
# TCP	    22	            MY-IP/24
# TCP	    3000	        0.0.0.0/0

# Remove previous pm2
sudo pm2 kill
sudo npm remove pm2 -g

# tested on ubuntu 20.04 / t3a.nano

sudo apt update && \
sudo apt upgrade -yq && \
sudo apt install cmake -yq && \

# Node.js 16.x (https://github.com/nodesource/distributions/blob/master/README.md#deb)
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && \
sudo apt-get install -y nodejs && \
sudo npm install -g npm@8.1.4 && \

# Install pm2
sudo npm install -g pm2@latest && \

# Install gitget
sudo npm install -g gitget@latest && \

# Navigate home
cd /home/ubuntu && \

# Download Repository
sudo -u ubuntu gitget nilschr/aws_node_gecko_server_client && \

# Install
cd aws_node_gecko_server_client && \
sudo -u ubuntu npm install && \

# PM2
sudo -u ubuntu pm2 start npm -- run serve && \
sudo -u ubuntu pm2 save && \
sudo env PATH="$PATH:/usr/bin" /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu && \
sudo -u ubuntu pm2 save && \

# Finish
cd ../ && \
sudo -u ubuntu echo "done" | sudo tee status.txt && \
sudo shutdown -r now