# => Build container
FROM node:alpine as builder
WORKDIR /app
COPY ./package.json .
RUN yarn
COPY ./ .
RUN yarn build

FROM nginx:1.22.0-alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY ./conf /etc/nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Default port exposure
EXPOSE 80
EXPOSE 443

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./.env .

# Add bash
RUN apk add --no-cache bash

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

USER 700
