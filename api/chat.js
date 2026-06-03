export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, preamble } = req.body;
    const apiKey = process.env.COHERE_API_KEY;

    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-r-plus",
        message: message,
        preamble: preamble,
        temperature: 0.4
      })
    });

    const data = await response.json();
    
    // Se Cohere risponde, inviamo il testo indietro
    if (data.text) {
        return res.status(200).json({ text: data.text });
    } else {
        // Se Cohere dà errore, lo logghiamo per capire perché
        return res.status(500).json({ error: "Errore Cohere: " + JSON.stringify(data) });
    }

  } catch (error) {
    return res.status(500).json({ error: "Errore server: " + error.message });
  }
}
