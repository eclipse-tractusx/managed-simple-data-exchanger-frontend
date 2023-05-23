
# => Build container
FROM node:18.12.1-alpine3.15 as builder

WORKDIR /app

COPY ./package.json .

COPY ./ .

RUN npm install && npm run build

#### Stage 2: Serve the application from Nginx

FROM nginx:1.24.0-alpine3.17

RUN apk update && apk upgrade

RUN  addgroup nginx nginx

# Nginx config
RUN rm -rf /etc/nginx/conf.d

COPY ./conf /etc/nginx

RUN chmod -R 777 /var/cache/nginx/ && chmod -R 777 /var/run

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

RUN chmod -R 755 /usr/share/nginx/html/

WORKDIR /usr/share/nginx/html

COPY ./env.sh .

USER nginx

EXPOSE 8080

# Start Nginx server

CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
