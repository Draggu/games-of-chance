# Games of chance

## Table of content

-   [Starting](#Starting)
-   [Features](#Features)
-   [Schema](#Schema)
-   [NTP](#NTP)
-   [Fairness](#Fairness)
-   [Technologies](#Technologies)

## Starting

run

```sh
docker compose up
```

graphql endpoint will be available at [http://localhost:8080/graphql]()

## Features

-   roulette game
-   dice game (against other players)
-   balance system
-   prove of fairness

## Schema

All needed information to comunicate with server
are available in [schema.gql](schema.gql) file

## NTP

This project asserts clocks on every node and db are synchronized.  
It can be achieved by running NTP client on every machine

## Fairness

For prove of fairness for all games see [fairness](FAIRNESS.md)

## Technologies

-   [NestJS](https://nestjs.com/)
-   [GraphQL](https://graphql.org/)
-   [TypeORM](https://typeorm.io/)
-   [Redis](https://redis.io/)
-   [PostgreSQL](https://www.postgresql.org/)
