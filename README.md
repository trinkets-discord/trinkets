# <img src="./public/trinkets.png" width="28px" alt="logo" /> trinkets

A global Discord trinket game.

##### run with node

```node
npm install
```

```node
npm run dev
```

##### run with docker

```bash
docker build -t {name} .
```

```bash
docker run -dp 127.0.0.1:3001:3001 {name}
```

## tiers & values

| Tier      | Value          |
| --------- | -------------- |
| common    | `10 - 25`      |
| uncommon  | `26 - 100`     |
| rare      | `101 - 500`    |
| epic      | `501 - 5000`   |
| legendary | `5001 - 10000` |

---

## config

### [.env](.env.example)

```env
BOT_TOKEN=
GUILD_ID=
MONGO_URI=
```

> - **BOT_TOKEN**: [Discord Developer Portal](https://discord.com/developers/applications)
> - **GUILD_ID**: *optional* for registering commands to a singular guild.
> - **MONGO_URI**: [Cloud: MongoDB](https://cloud.mongodb.com/)

### [config.json](config.json)

#### values

```json
{
    //...
    "values": {
        "common": {
            "min": 10,
            "max": 25
        },
        //...
    }
}
```

> set the minimum and maximum value of each tier. the value will be randomly determined upon each find.

#### colors

```json
{
    "colors": {
        //...
        "tiers": {
            "common": "#adadad",
            //...
        }
    }
}
```

> determines the color of the embed when that specific tier of trinket is found.

#### constants

```json
{
    "constants": {
        "level_rate": 1.25,
        "default_exp": 100,
        "value_bias": 5.3
    },
    // ...
}
```

> - **level_rate**: the rate in which the amount of experience required for the next level is multiplied
> - **default_exp**: the default amount of experience required to level up at the base level (1)
>   - ex. if the `default_amount` = **100** and `rate` = **1.5**, then the *next* level (2) will require `100 * 1.25` (125) experience for the next level, etc...
> - **value_bias**: higher values will result in lower chances of the value of trinkets being close to the maximum value

---

## commands

- `/add [name] [image]`
  - adds a global trinket to the game
- `/find`
  - find a random trinket
- `/profile`
  - display your trinket count, level, and experience
