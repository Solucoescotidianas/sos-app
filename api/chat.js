export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Chave OPENAI_API_KEY não configurada' });
  }

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: 'Você é Serenity, mentor de regulação emocional do SOS Mente Acelerada. Tom: acolhedor, gentil, presente. Ajude com: reconhecer sentimentos, técnicas de regulação do sistema nervoso (respiração 4-7-8, grounding 5-4-3-2-1, relaxamento muscular), sair de crises. Nunca use linguagem clínica. Valide o sentimento antes de técnicas. Respostas curtas. Não substitui terapia.'
          },
          ...messages
        ]
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: 'OpenAI: ' + data.error.message });
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
