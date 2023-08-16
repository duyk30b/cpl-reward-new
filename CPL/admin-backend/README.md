## Installation
1. Clone project, make `.env` file from `.env.example`.
2. Generate public/private key pair for JWT. For example:


```sh
ssh-keygen -t rsa -P "" -b 4096 -m PEM -f jwt.key
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
```

3. Copy generated keys to folder `jwt_key` then update below environment variables (you can use seperate key for access token and refresh token if needed):

```
ACCESS_JWT_PUBLIC_KEY=jwt.key.pub
ACCESS_JWT_PRIVATE_KEY=jwt.key
REFRESH_JWT_PUBLIC_KEY=jwt.key.pub
REFRESH_JWT_PRIVATE_KEY=jwt.key
```

4. Use below docker commands to build and run project:

```sh
# install node_modules from docker to local
docker-compose run --rm app npm ci
# build 'api' mono app dist
docker-compose run --rm app npm run build api
# build 'commander' mono app dist
docker-compose run --rm app npm run build commander
# build image
docker-compose build
# up container
docker-compose up
```


P/S: Please NEVER run ```npm ci``` or any npm command on your local machine
