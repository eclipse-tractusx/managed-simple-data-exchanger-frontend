# => Build container
FROM node:18.9.0-alpine3.15 as builder

WORKDIR /app

COPY ./package.json .

COPY ./ .

RUN npm install && npm run build

#### Stage 2: Serve the application from Nginx 
FROM ubuntu/nginx:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y nocache

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY ./default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

#RUN chown -R nginx:nginx /usr/share/nginx/html && chmod -R 755 /usr/share/nginx/html && \
#    chown -R nginx:nginx /var/log/nginx && \
#    chown -R nginx:nginx /var/lib/nginx && \
#    chown -R nginx:nginx /etc/nginx/conf.d && \
#    chown -R nginx:nginx /var/log 

#RUN chown -R nginx:nginx /var/log/nginx/error.log && chmod -R 755 /var/log/nginx/error.log
        
#RUN touch /var/run/nginx.pid && \
#     chown -R nginx:nginx /var/run/nginx.pid

USER nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Default port exposure

EXPOSE 80
EXPOSE 443

COPY ./env.sh .

CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
