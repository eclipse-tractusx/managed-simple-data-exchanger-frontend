# Managed Simple Data Exchanger

This repository contains the frontend code for the Managed Simple Data Exchanger written in React and Typescript.

The Managed Simple Data Exchanger application consists of

- [managed-simple-data-exchanger-frontend](https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend)
- [managed-simple-data-exchanger-backend](https://github.com/eclipse-tractusx/managed-simple-data-exchanger-backend)

![Tag](https://img.shields.io/static/v1?label=&message=LeadingRepository&color=green&style=flat) The helm chart for installing the Managed Simple Data Exchanger is available in [managed-simple-data-exchanger](https://github.com/eclipse-tractusx/managed-simple-data-exchanger).

The Managed Simple Data Exchanger is designed to work with the [IAM](https://github.com/eclipse-tractusx/portal-iam).

Note: if you'd like to know more about what Managed Simple Data Exchanger contains and what the application does, then please checkout the [user-guide](https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/blob/main/docs/user-guide/README.md).

## Run locally

Here are the two ways to run the application locally on http://localhost:3000/

### Local build & run

    npm install
    npm run build
    npm start

### Running the image from GitHub container registry

    export IMAGE=tractusx/sdefrontend:latest
    docker pull $IMAGE
    docker run --rm -d -p 3001:8080 --name sdefrontend $IMAGE

## Notice for Docker image

This application provides container images for demonstration purposes.

DockerHub: https://hub.docker.com/r/tractusx/managed-simple-data-exchanger-frontend 

Eclipse Tractus-X product(s) installed within the image:

- GitHub: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend
- Project home: https://projects.eclipse.org/projects/automotive.tractusx
- Dockerfile: https://github.com/eclipse-tractusx/managed-simple-data-exchanger-frontend/blob/main/Dockerfile
- Project license: [Apache License, Version 2.0] https://github.com/eclipse-tractusx/managed-simple-data-exchanger-backend/blob/main/LICENSE

**Used base image**
- [nginxinc/nginx-unprivileged:alpine3.18-perl]
- Dockerfile: [nginxinc/nginx-unprivileged:alpine](https://github.com/nginxinc/docker-nginx-unprivileged/blob/main/Dockerfile-alpine.template)
- GitHub project: [https://github.com/nginxinc/docker-nginx-unprivileged](https://github.com/nginxinc/docker-nginx-unprivileged)
- DockerHub: [https://hub.docker.com/r/nginxinc/nginx-unprivileged](https://hub.docker.com/r/nginxinc/nginx-unprivileged)

As with all Docker images, these likely also contain other software which may be under other licenses (such as Bash, etc from the base distribution, along with any direct or indirect dependencies of the primary software being contained).

As for any pre-built image usage, it is the image user's responsibility to ensure that any use of this image complies with any relevant licenses for all software contained within.

## License

Distributed under the Apache 2.0 License.
See [LICENSE](./LICENSE) for more information.