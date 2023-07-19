
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
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build .
COPY ./env.sh .
RUN chown 101:101 /usr/share/nginx/html/
RUN chmod ug+rwx /usr/share/nginx/html/
EXPOSE 8080
USER 101
# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
#CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
