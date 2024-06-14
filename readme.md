# Streak scraper
Simple tool that uses puppeteer to find a user's current duolingo streak and responds with an API response. Meant to be used for a single user to prevent abuse. Used for fun on [my personal website](https://github.com/Duveaux/vtvc.nl).

Since streaks can only change once per day, the response is cached for 24 hours. If you want you can invoke the `/refresh` endpoint to sync this up with your daily habbits so updates always arrive timely.

# Installation
## Docker compose
```
streak-scraper:
    container_name: Streak-Scraper
    image: vicvc/duolingo-streak-scraper:latest
    ports:
        - 40573:3000
    environment:
        DUOLINGO_USER: DUOLINGO_USERNAME
        SECRET: [random string]
    restart: unless-stopped
```

## Docker CLI
```
docker run -p 40573:3000 -e DUOLINGO_USER="DUOLINGO_USERNAME" -e secret [secret] vicvc/duolingo-streak-scraper:latest
```

## Node.js (manually)
Make sure you have a headless chromium installed and everything is set up correctly to run puppeteer.

**Install**
``` bash
git clone git@github.com:Duveaux/duolingo-streak-scraper.git
cd duolingo-streak-scraper
yarn install
cp .env.example .env
```
Edit `.env` to include your chosen environment variables.


**Run**
```
yarn start
```

# Configuration & use
* The lefthand port (40573 in the example) can be changed to whatever
* Your DUOLINGO_USER is required and is the user that will be scraped.
* If you set the secret, you'll get an additional route `/refresh?secret=[your secret]` that you can use to force the cache to expire, if needed.

You can now access your access your your streak at `http://localhost:40573`. The response will be like this.

```json
{
    "streak": 304,
    "cache": "hit",
    "next_refresh": "15-6-2024, 19:17:55"
}
```
* `streak` is the users current streak
* `cache` indicates if this was served from cache or if it was freshly fetched
* `next_refresh` tells you when the cache will expire and a new streak will be refreshed when invoked. You can reset this by invoking the `refresh` route.

New data will be retrieved up to once a day to increase performance and decrease abuse. It is scraping after all. 