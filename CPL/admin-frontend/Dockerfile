FROM  612964901073.dkr.ecr.ap-southeast-1.amazonaws.com/node:14-alpine as builder

WORKDIR /app

COPY . .

RUN npm install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

RUN npm run build

RUN rm -rf node_modules && \
  NODE_ENV=production npm install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

FROM 612964901073.dkr.ecr.ap-southeast-1.amazonaws.com/nginx:latest
COPY ./nginx/admin.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist  /usr/share/nginx/html
