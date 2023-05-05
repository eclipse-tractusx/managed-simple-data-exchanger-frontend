
# => Build container
FROM node:18.12.1-alpine3.15 as builder

WORKDIR /app
COPY ./package.json .
#RUN yarn
COPY ./ .
#RUN yarn build

RUN npm install && npm run build

#### Stage 2: Serve the application from Nginx

FROM nginx:1.23.4

#ENV CURL_VERSION=7.87.0

# Nginx config
RUN rm -rf /etc/nginx/conf.d

COPY ./conf /etc/nginx

RUN chmod -R 777 /var/cache/nginx/ && chmod -R 777 /var/run

#RUN chmod -R 777 /var/lib/nginx && chmod -R 777 /var/log/nginx/

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

RUN chmod -R 755 /usr/share/nginx/html/

WORKDIR /usr/share/nginx/html

COPY ./env.sh .

USER nginx

EXPOSE 8080

# Start Nginx server

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
