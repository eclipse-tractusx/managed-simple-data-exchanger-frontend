# => Build container
FROM node:alpine as builder
WORKDIR /app
COPY ./package.json .
RUN yarn
COPY ./ .
RUN yarn build

#FROM nginx:1.22.0-alpine
FROM nginx:stable-alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY ./conf /etc/nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Default port exposure
EXPOSE 80
EXPOSE 443

ARG UID=7000
ARG GID=7000

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./.env .

# Add bash
RUN apk add --no-cache bash

RUN chown ${UID}:${GID} /usr/share/nginx/html

USER ${UID}:${GID}

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
