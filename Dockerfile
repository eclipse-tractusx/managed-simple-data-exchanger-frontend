FROM nginx:1.15.4-alpine

RUN addgroup -g 1033 -S www-group && \
    adduser -u 1033 -S www-user -G www-group

COPY --chown=www-user:www-group ./nginx.conf /etc/nginx/nginx.conf
COPY --chown=www-user:www-group ./default.conf /etc/nginx/conf.d/default.conf

#COPY --chown=www-user:www-group index.html /var/www/htdocs/index.html

RUN touch /var/run/nginx.pid && \
  chown -R www-user:www-group /var/run/nginx.pid && \
  chown -R www-user:www-group /var/cache/nginx

USER 1033

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
