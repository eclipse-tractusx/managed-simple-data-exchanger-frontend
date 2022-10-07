# => Build container
FROM node:18.9.0-alpine3.15 as builder
WORKDIR /app
COPY ./package.json .
#RUN yarn
COPY ./ .
#RUN yarn build

RUN npm install && npm run build

#FROM nginx:1.22.0-alpine
FROM ubuntu/nginx:latest
#FROM nginx:stable
RUN apt-get update && apt-get upgrade -y

#NON-ROOT USER 
ARG USERNAME=dftuser
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create the user
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && /etc/init.d/nginx start
    
RUN  chown -R $USERNAME:$USERNAME /var/log/nginx/error.log && chmod -R 755 /var/log/nginx/error.log
    
USER $USERNAME

# Nginx config
#RUN sudo rm -rf /etc/nginx/conf.d

COPY ./conf /etc/nginx

# Static build
COPY --from=builder /app/build /usr/share/nginx/html/

# Default port exposure

EXPOSE 80
EXPOSE 443

#ARG UID=7000
#ARG GID=7000

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html

COPY ./env.sh .

#COPY .env .
# Add bash
#RUN apk add --no-cache bash

#RUN apt-get update -y && sudo apt-get install -y nocache

#RUN chown ${UID}:${GID} /usr/share/nginx/html

#USER ${UID}:${GID}

#RUN chmod 744 env.sh && chmod 744 -R /usr/share/nginx/html/*

#RUN chmod 744 -R /usr/share/nginx/html/*

# Start Nginx server
#CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
