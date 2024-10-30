# Beer scraper
Simple tool that scrapes some information from untappd and makes it available in an API. Meant to be used for a single user to prevent abuse. Used for fun on [my personal website](https://github.com/Duveaux/vtvc.nl).

Also employs caching to improve performance. Tweak it to suit your own needs

# Installation
## Docker compose
```
beer-scraper:
    container_name: Beer-Scraper
    image: vicvc/untappd-beer-scraper:latest
    ports:
        - 6157:3000
    environment:
        UNTAPPD_USER: untappd username
        SECRET: [random string]
        TTL: 43200
    restart: unless-stopped
```

## Docker CLI
```
docker run -p 6157:3000 -e UNTAPPD_USER="UNTAPPD_USERNAME" -e secret [secret] -e TTL 43200 vicvc/untappd-beer-scraper:latest
```

## Node.js (manually)
Make sure you have a headless chromium installed and everything is set up correctly to run puppeteer.

**Install**
``` bash
git clone git@github.com:Duveaux/untappd-beer-scraper.git
cd untappd-beer-scraper
yarn install
cp .env.example .env
```
Edit `.env` to include your chosen environment variables.


**Run**
```
yarn start
```

# Configuration & use
* The lefthand port (6157 in the example) can be changed to whatever
* Your UNTAPPD_USER is required and is the user that will be scraped.
* If you set the secret, you'll get an additional route `/refresh?secret=[your secret]` that you can use to force the cache to expire, if needed.
* Cache is set to 1 day by default, but can be tweaked by setting the TTL variable. Match this with expected update frequency.

You can now access your access your your data at `http://localhost:6157`. The response will be like this.

```json
{
    "data": {
        "username": "Your username",
        "location": "Your location",
        "totalBeers": 779,
        "uniqueBeers": 641,
        "badges": 668,
        "friends": 21
    },
    "cache": "hit",
    "next_refresh": "15-6-2024, 19:17:55"
}
```
* `data` contains data retrieved from the profile
* `cache` indicates if this was served from cache or if it was freshly fetched
* `next_refresh` tells you when the cache will expire and a new streak will be refreshed when invoked. You can reset this by invoking the `refresh` route.

New data will be retrieved up to once a day to increase performance and decrease abuse. It is scraping after all. 