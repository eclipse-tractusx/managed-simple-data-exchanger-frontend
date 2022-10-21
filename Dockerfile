# => Build container
FROM node:18.9.0-alpine3.15 as builder

WORKDIR /app

COPY ./package.json .

COPY ./ .

RUN npm install && npm run build

#### Stage 2: Serve the application from Nginx 

FROM ubuntu:22.04

RUN apt-get update && apt-get upgrade -y && apt-get install nginx -y && apt update 

RUN mv /etc/nginx/nginx.conf nginx.cong.bak

# Nginx config
RUN sudo rm -rf /etc/nginx/conf.d

COPY nginx.conf /etc/nginx/conf.d

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Default port exposure

EXPOSE 80
EXPOSE 443

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html

COPY ./env.sh .

RUN apt-get update -y && sudo apt-get install -y nocache \
    && chmod 744 env.sh && chmod 744 -R /usr/share/nginx/html/* \
    && chmod 744 -R /usr/share/nginx/html/*

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
