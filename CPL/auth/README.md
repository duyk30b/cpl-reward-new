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
docker-compose build
docker-compose up
```
5. Run migration:

```sh
docker exec customer_dev npm run migrate:run
```

If everything ok, we can make request to `http://localhost:3000` for check.

**Note:** When building with docker:
- We can change environment variables to fit our need except below variables:

```
AUTHENTICATE_MYSQL_MASTER_HOST=db
AUTHENTICATE_MYSQL_MASTER_PORT=3306
AUTHENTICATE_REDIS_HOST=redis
```

## Api docs

After running the application, you can access `http://localhost:3000/document` to get the documentation and test the api.

## Testing
Updating...
