FROM node:alpine as base

WORKDIR /app

COPY . .

RUN yarn && yarn build

FROM node:alpine as prod

ENV NODE_ENV=production

WORKDIR /app

COPY .yarnrc.yml \
    package.json \
    yarn.lock ./

COPY .yarn/plugins .yarn/plugins
COPY .yarn/releases .yarn/releases

COPY --from=base /app/dist ./dist

RUN yarn workspaces focus --all --production && yarn cache clean

ENTRYPOINT yarn start:prod