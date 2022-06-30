# Fairness

-   [formula](#formula)
-   [games](#games)
    -   [roulette](#roulette)
    -   [dice](#dice)

## formula

Every game result is calculated using following formula  
where `privateKey`, `publicKey` and `nonce` are delivered by game.

```ts
function reuslt(privateKey: string, publicKey: string, nonce: string | number) {
    const seed = [privateKey, publicKey, nonce].join('-');

    const subHash = createHmac('sha256', seed).digest('hex').substring(0, 8);

    const spinNumber = parseInt(subHash, 16);

    return Math.abs(spinNumber) % range;
}
```

it is deterministic so result of every game can validated

# games

## roulette

roulette `privateKey` and `publicKey` are generated daily and are publicly available,
however `privateKey` of today seed is hashed (will be revealed next day).
`nonce` is incremental number of roulette rolls.
According to this results of rolls are predermined for day and as so can not be manipulated

## dice

dice `publicKey` can be specified by user. Every time this action is done server seed (used as `privateKey`) is revealed and next one is generated (only hashed one can be seen).
For `nonce` is used incremental number of dice rolls (across all users).
Because `privateKey` and `publicKey` are created before the game it can not be manipulated.
