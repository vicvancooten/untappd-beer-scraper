# Streak scraper
Simple tool that uses puppeteer to find a user's current duolingo streak and responds with an API response. Meant to be used for a single user to prevent abuse. Used on my personal website.

Since streaks can only change once per day, the response is cached for 24 hours.

# How to use
## Docker compose
```
streak-scraper:
    container_name: Streak-Scraper
    image: vicvc/duolingo-streak-scraper:latest
    ports:
        - 40573:3000
    environment:
        DUOLINGO_USER: DUOLINGO_USERNAME
    restart: unless-stopped
```

## Docker CLI
```
docker run -p 40573:3000 -e DUOLINGO_USER="DUOLINGO_USERNAME" vicvc/duolingo-streak-scraper:latest
```

# Configuration & use
* The lefthand port (40573 in the example) can be changed to whatever
* Your DUOLINGO_USER is required and is the user that will be scraped.

You can now access your access your your streak at `http://localhost:40573`. The response will be like this.

```json
{
    "streak": 302,
    "cache": "miss"
}
```
* `streak` is the users current streak
* `cache` indicates if this was served from cache or if it was freshly fetched

New data will be retrieved up to once a day to increase performance and decrease abuse. It is scraping after all. 