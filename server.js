const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors'); // Add CORS support
const app = express();
const port = 3000;

// Use environment variable for API key
const apiKey = process.env.GEMINI_API_KEY || "your-api-key-here";

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS for all routes

app.post('/gemini', async (req, res) => {
    const prompt = req.body.prompt;

    // Validate the prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        return res.status(400).json({ error: "Invalid or missing 'prompt' field" });
    }

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                prompt: prompt // Adjusted to match expected API format
            })
        });

        // Check if the response is successful
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error from Gemini API:", errorData);
            return res.status(response.status).json({ error: errorData });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});