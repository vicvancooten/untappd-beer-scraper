const puppeteer = require('puppeteer');
require('dotenv').config();

/**
 * Scrape the current Duolingo streak of the user.
 * @returns {Promise<number>} The current Duolingo streak of the user
 */
async function scrapeStreak() {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(`https://www.duolingo.com/profile/${process.env.DUOLINGO_USER}`)

    // Wait for the page to load fully
    await page.waitForSelector('h4')

    // Find the element that has both a H4 as well as the text "Day streak". Return the text content of the H4.
    const streak = await page.evaluate(() => {
        // Find all div elements
        const divs = Array.from(document.querySelectorAll('div'))

        // Find the div that contains both an h4 and the text "Day streak"
        // We don't rely on class names, because they are likely to change
        for (const div of divs) {
            const h4 = div.querySelector('h4')
            if (h4 && div.textContent?.includes('Day streak')) {
                return h4.textContent
            }
        }
        return null
    })

    await browser.close()
    return parseInt(`${streak}`)
}

module.exports = scrapeStreak;
