FROM node:latest AS frontend-build

WORKDIR /app

COPY frontend/package.json .

RUN yarn

COPY frontend/ .

RUN yarn build

FROM node:latest

WORKDIR /app

COPY backend/package.json .

RUN yarn

COPY backend/ .

COPY --from=frontend-build /app/dist /app/static

CMD yarn start:prod
