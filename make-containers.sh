#!/bin/bash
docker build --tag node-website-docker:latest --file Dockerfile-Website .
docker build --tag node-refresher-docker:latest --file Dockerfile-Refresher .