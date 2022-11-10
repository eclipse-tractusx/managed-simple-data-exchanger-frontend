# => Build container
#FROM node:18.9.0-alpine3.15 as builder
#
# Dockerfile with full build after checkout
#
# usage:
#        yarn build:docker:full
#

# Step 1
FROM node:16-alpine as build-step

RUN apk add jq
COPY . /app
WORKDIR /app
RUN yarn
RUN yarn build

# Step 2
FROM nginxinc/nginx-unprivileged:alpine
COPY conf/conf.d/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /app/cx-portal/build /usr/share/nginx/html
USER 101




#USER nginx 

EXPOSE 8080

# Start Nginx server
#CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

#EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
