// server.js
const express = require('express');
const scrapeStreak = require('./scrape');
const NodeCache = require('node-cache');
const app = express();
const port = 3000;

// Streak won't change often, so cache the response for a day
const cache = new NodeCache({ stdTTL: 86400 });

// Main endpoint
app.get('/', async (req, res) => {
    // Log it in case someone is interested
    const cachedResult = cache.get('taskResult');
    if (cachedResult) {
        console.log(`${new Date().toLocaleString()} - Cache hit - ${cachedResult} day streak.`)
        return res.json({ result: cachedResult, cache: 'hit' });
    }

    try {
        const result = await scrapeStreak();
        cache.set('taskResult', result);
        console.log(`${new Date().toLocaleString()} - Cache miss - ${result} day streak.`)
        res.json({ result: result, cache: 'miss' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
