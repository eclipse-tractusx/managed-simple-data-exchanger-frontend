# => Build container
FROM node:18.9.0-alpine3.15 as builder
WORKDIR /app
COPY ./package.json .
#RUN yarn
COPY ./ .
#RUN yarn build

RUN npm install && npm run build

#### Stage 2: Serve the application from Nginx 

FROM ubuntu/nginx:latest 

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y nocache 

# Nginx config
RUN rm -rf /etc/nginx/conf.d 
#RUN mv /etc/nginx/nginx.conf nginx.cong.bak 

#COPY default.conf /etc/nginx/conf.d

COPY  default.conf /etc/nginx/

#RUN chmod -R 777 /var/nginx/ && chmod -R 777 /var/run/

RUN chmod -R 777 /var/lib/nginx && chmod -R 777 /var/log/nginx/

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html

COPY ./env.sh .

USER nginx 

EXPOSE 8080

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

#EXPOSE 8080

#CMD ["nginx", "-g", "daemon off;"]
