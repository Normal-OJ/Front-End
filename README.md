# Normal OJ Web Frontend

## ❗️Caution

We'll NOT maintain the first version of NOJ Front-End (this repository) in the future and please see our new Front-End repository https://github.com/Normal-OJ/new-front-end

## Contributing Guide

Clone this project via SSH:

```shell
$ git clone git@gitlab.noj.tw:noj/codebase/frontend.git
$ cd frontend
```

Install node modules with npm:

```shell
$ npm install
```

Clone `.env.example` as `.env` and specify the environment variables

```shell
$ cp .env.example .env
# modify the content in .env
```

`vue-cli-service` provides hot-reloads for development environment:

```shell
$ npm run serve
```

You can refer to Vue.js CLI documentation: https://cli.vuejs.org/config

## Building for production

```shell
$ npm run build
```

## Testing

```shell
$ npm run test
```
