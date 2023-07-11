
# => Build container
FROM node:18.12.1-alpine3.15 as builder

WORKDIR /app

COPY ./package.json .

COPY .env . 

COPY ./ .

RUN npm install && npm run build

#### Stage 2: Serve the application from Nginx

FROM nginxinc/nginx-unprivileged:1.25.1-perl

# Nginx config
RUN rm -rf /etc/nginx/conf.d
USER root 
COPY ./conf /etc/nginx
# Static build
COPY --from=builder /app/build /usr/share/nginx/html/
RUN chmod ugo+rwx /usr/share/nginx/html/
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
EXPOSE 8080
USER 101
# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]