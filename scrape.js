const puppeteer = require('puppeteer');
require('dotenv').config();


/**
 * Scrape the available information from the public profile of the selected user.
 * @returns {Promise} Profile data & stats of the selected user.
 */
async function scrapeStats() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`https://untappd.com/user/${process.env.UNTAPPD_USER}`)

    // Wait for the page to load fully
    await page.waitForSelector('div.info')

    // Find the element that has both a H4 as well as the text "Day streak". Return the text content of the H4.
    const scrapedData = await page.evaluate(() => {
        // Find the info class
        const info = document.querySelector('div.info')

        // Username and location
        const username = info?.querySelector('.username')?.textContent
        const location = info?.querySelector('.location')?.textContent

        console.log(username, location);

        // Element that contains the stats
        const stats = info?.querySelector('.stats')

        // Collect beer stats
        // 1. Total
        // 2. Unique
        // 3. Badges
        // 4. Friends
        const totalBeers = parseInt(stats?.querySelector('a:first-of-type')?.querySelector('.stat')?.textContent ?? '0')
        const uniqueBeers = parseInt(stats?.querySelector('a:nth-of-type(2)')?.querySelector('.stat')?.textContent ?? '0')
        const badges = parseInt(stats?.querySelector('a:nth-of-type(3)')?.querySelector('.stat')?.textContent ?? '0')
        const friends = parseInt(stats?.querySelector('a:last-of-type')?.querySelector('.stat')?.textContent ?? '0')

        return { username, location, totalBeers, uniqueBeers, badges, friends }
    })

    await browser.close()

    return scrapedData
}

module.exports = scrapeStats;
