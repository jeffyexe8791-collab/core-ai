export default async function handler(req, res) {
  // Gestione della sicurezza CORS per Neocities
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, preamble } = req.body;
    const apiKey = process.env.COHERE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Chiave API non configurata sul server Vercel.' });
    }

    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus",
        message: message,
        preamble: preamble,
        temperature: 0.4
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
// update
