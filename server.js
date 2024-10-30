/**
 * Main server file
 * Contains the main routes and logic for the server
 */
const express = require('express');
const scrapeStats = require('./scrape');
const NodeCache = require('node-cache');
const app = express();
const port = 3000;

// Streak won't change often, so cache the response for a day
const cache = new NodeCache({ stdTTL: process.env.TTL ? parseInt(process.env.TTL) : 43200 });

/**
 * Main route
 * Scrapes, caches and returns the data
 * Prefers to respond from cache
 */
app.get('/', async (req, res) => {
    const cachedResult = cache.get('taskResult');
    if (cachedResult) {
        // Log it, for internal monitoring
        console.log(`${new Date().toLocaleString()} - Cache hit - ${cachedResult}.`)

        // Return the cached result
        return res.json({
            data: cachedResult,
            cache: 'hit',
            next_refresh: new Date(cache.getTtl('taskResult')).toLocaleString('nl-NL')
        });
    }

    // Cache miss, scrape and cache the streak
    try {
        const data = await scrapeStats();
        cache.set('taskResult', data);

        console.log(`${new Date().toLocaleString()} - Cache miss - ${data}.`)

        res.json({
            data,
            cache: 'miss',
            next_refresh: new Date(cache.getTtl('taskResult')).toLocaleString('nl-NL')
        });
    } catch (error) {
        // Respond with error
        res.status(500).json({ error: error.message });
    }
});

/**
 * Clear cache route
 * Can only be set if the SECRET env is set, since it shouldn't be publicly accessible
 * Clears the cache and automatically repopulates it
 */
app.get('/refresh', async (req, res) => {
    if (process.env.SECRET !== req.query.secret) {
        return res.status(403).json({ error: 'Provide the correct secret in the URL parameter' });
    }

    // Delete cache
    cache.del('taskResult');

    // Refetch and cache
    const data = await scrapeStats();
    cache.set('taskResult', data);
    console.log(`${new Date().toLocaleString()} - Cache cleared and refetched - ${data}.`)

    // Respond with the new streak
    res.json({
        message: 'Forced a refresh',
        data,
        next_refresh: new Date(cache.getTtl('taskResult')).toLocaleString('nl-NL')
    });
})


// Start the server
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});