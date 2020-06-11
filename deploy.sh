#!/bin/bash

appDir=/opt/apps/
distDir=dist-$(date +"%F")

tarFile="$distDir".tar.gz
tar -czf "$tarFile" ./dist
sleep 1

scp -i /usr/lib/jenkins/jenkins-auth -o StrictHostKeyChecking=no $tarFile root@95.179.201.200:$appDir
sleep 1
rm -f "$tarFile"