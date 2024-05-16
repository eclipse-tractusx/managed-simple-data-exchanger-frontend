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

### Running the image 

    export IMAGE=tractusx/managed-simple-data-exchanger-frontend:latest
    docker pull $IMAGE
    docker run --rm -d -p 3001:8080 --name sdefrontend $IMAGE

## License

Distributed under the Apache 2.0 License.
See [LICENSE](./LICENSE) for more information.

## Notice for Docker image

Bellow you can find the information regarding Docker Notice for this application.

  - [Managed-simple-data-exchanger](DOCKER_NOTICE.md)