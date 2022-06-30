# Games of chance

## Table of content

-   [Starting](#Starting)
-   [NTP](#NTP)
-   [schema](#Schema)
-   [fairness](#Fairness)

## Starting

run

```sh
docker compose up
```

graphql endpoint will be available at [http://localhost:8080/graphql]()

## NTP

This project asserts clocks on every node and db are synchronized.  
It can be achieved by running NTP client on every machine

## Schema

All needed information to comunicate with server
are available in [schema.gql](schema.gql) file

## Fairness

For prove of fairness for all games see [fairness](FAIRNESS.md)
