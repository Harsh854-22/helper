// pages/api/gemini.ts
const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const { prompt } = req.body;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    try {
      const geminiRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      const data = await geminiRes.json();

      if (geminiRes.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        res.status(200).json({ result: data.candidates[0].content.parts[0].text.trim() });
      } else {
        console.error("Gemini API returned unexpected response:", data);
        res.status(500).json({ 
          error: data.error?.message || 'Invalid response from Gemini API' 
        });
      }
    } catch (err) {
      console.error("Gemini fetch failed:", err);
      res.status(500).json({ 
        error: err.message || 'Request to Gemini failed' 
      });
    }
}   