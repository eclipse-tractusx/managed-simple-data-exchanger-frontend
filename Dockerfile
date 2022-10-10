# => Build container
FROM node:18.9.0-alpine3.15 as builder
WORKDIR /app
COPY ./package.json .
#RUN yarn
COPY ./ .
#RUN yarn build

RUN npm install && npm run build

#### Stage 2: Serve the application from Nginx 

FROM nginx:1.23.1

# Nginx config
RUN rm -rf /etc/nginx/conf.d

COPY ./conf /etc/nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html

COPY ./env.sh .

EXPOSE 80
EXPOSE 443

#COPY .env .
# Add bash
RUN apk add --no-cache bash

#RUN apt-get update -y && sudo apt-get install -y nocache

#RUN chown ${UID}:${GID} /usr/share/nginx/html

#USER ${UID}:${GID}

#RUN chmod 744 env.sh && chmod 744 -R /usr/share/nginx/html/*

#RUN chmod 744 -R /usr/share/nginx/html/*

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
