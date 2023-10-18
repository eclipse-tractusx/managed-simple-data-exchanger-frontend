#################################################################################
# Copyright (c) 2021,2022,2023 T-Systems International GmbH
# Copyright (c) 2021,2022,2023 Contributors to the Eclipse Foundation
#
# See the NOTICE file(s) distributed with this work for additional
# information regarding copyright ownership.
#
# This program and the accompanying materials are made available under the
# terms of the Apache License, Version 2.0 which is available at
# https://www.apache.org/licenses/LICENSE-2.0.
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# SPDX-License-Identifier: Apache-2.0
################################################################################
# => Build container
FROM node:18.12.1-alpine3.15 as builder

WORKDIR /app

RUN apk update && apk add --no-cache jq

COPY ./package.json .

COPY .env . 

COPY ./ .

RUN npm install && npm run build

#### Stage 2: Serve the application from Nginx

FROM nginxinc/nginx-unprivileged:alpine3.18-perl
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

CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
#CMD ["nginx", "-g", "daemon off;"]
