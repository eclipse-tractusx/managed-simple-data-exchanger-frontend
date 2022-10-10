# => Build container
FROM node:18.9.0-alpine3.15 as builder

WORKDIR /app

COPY ./package.json .

COPY ./ .

RUN npm install && npm run build

#### Stage 2: Serve the application from Nginx 
#FROM ubuntu:22.04
FROM nginxinc/nginx-unprivileged:1.22-alpine

#RUN apt-get update && apt-get upgrade -y &&apt install nginx -y && apt-get install -y nocache && apt update

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./default.conf /etc/nginx/conf.d/default.conf

RUN /bin/sh -c "apk add --no-cache bash"

WORKDIR /usr/share/nginx/html

#RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html && \
#    chown -R nginx:nginx /var/log/nginx && \
#    chown -R nginx:nginx /var/lib/nginx && \
#    chown -R nginx:nginx /etc/nginx/conf.d && \
#    chown -R nginx:nginx /var/log 
       
#RUN touch /var/run/nginx.pid && \
#    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Default port exposure

EXPOSE 8181

COPY ./env.sh .

#CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
CMD ["nginx", "-g", "daemon off;"]
