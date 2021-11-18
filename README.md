# Normal OJ Web Frontend

A Vue.js based web project that communicates with the backend via XHR requests.

## Demo

A production site of this repo is live on https://noj.tw.

## Installation 

Install node modules with npm:

```shell
npm install
```

## Run Locally

Clone this repository via SSH:

```shell
git clone git@gitlab.noj.tw:noj/codebase/frontend.git
cd frontend
```

Install node modules with npm:

```shell
npm install
```

`vue-cli-service` enables hot-reloading for development scenario:

```shell
npm run serve
```

## Deployment

To deploy this project, trigger a GitLab CI pipeline. A Caddy container containing the artifacts will be built and pushed to the Container Registry. After that Ansible kicks in and deploys the new container with Docker Compose.

## Documentation

TODO

## License

[MIT](https://choosealicense.com/licenses/mit/)
