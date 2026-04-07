const LIBRE_HOSTS = [
  "libretranslate.de",
  "translate.terraprint.co",
  "translate.argosopentech.com",
];

export default async function handler(req, res) {
  const { url } = req;
  // URL формат: /api/translate/en/ru/текст
  const match = url.replace(/^\/api\/translate\/?/, "");
  const parts = match.split("/");

  if (parts.length < 3) {
    return res.status(400).json({ error: "Format: /api/translate/en/ru/text" });
  }

  const source = parts[0];
  const target = parts[1];
  const text = decodeURIComponent(parts.slice(2).join("/"));

  // Попробовать LibreTranslate
  for (const host of LIBRE_HOSTS) {
    try {
      const response = await fetch(`https://${host}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: source,
          target: target,
          format: "text",
        }),
      });

      if (!response.ok) continue;

      const data = await response.json();
      if (data.translatedText) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.status(200).json({ translation: data.translatedText });
      }
    } catch {
      continue;
    }
  }

  // Фолбэк — Lingva
  const LINGVA_HOSTS = [
    "lingva.ml",
    "lingva.thedaviddelta.com",
  ];

  for (const host of LINGVA_HOSTS) {
    try {
      const encoded = encodeURIComponent(text);
      const response = await fetch(
        `https://${host}/api/v1/${source}/${target}/${encoded}`,
        { headers: { Accept: "application/json" } }
      );

      if (!response.ok) continue;
      const data = await response.json();
      if (data.translation) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.status(200).json(data);
      }
    } catch {
      continue;
    }
  }

  res.status(502).json({ error: "All translation services failed" });
}
