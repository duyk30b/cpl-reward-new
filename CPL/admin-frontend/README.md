## Installation
1. Clone project, make `.env` file from `.env.example`.
2. Clone project, make `public/example.config.json` file from `public/config.json`.

3. Use below docker commands to install ```node_modules``` project:


```sh
# install node_modules from docker to local
docker-compose run --rm app npm ci
```
P/S: Please NEVER run ```npm ci``` or any npm command on your local machine

Run below command to up project

```shell
npm run dev
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

