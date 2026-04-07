const LINGVA_HOSTS = [
  "lingva.ml",
  "lingva.thedaviddelta.com",
  "translate.plausibility.cloud",
];

export default async function handler(req, res) {
  const { url } = req;
  const path = url.replace(/^\/api\/translate/, "") || "/";

  for (const host of LINGVA_HOSTS) {
    try {
      const target = `https://${host}/api/v1${path}`;
      const response = await fetch(target, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) continue;

      const data = await response.json();

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.status(200).json(data);
    } catch {
      continue;
    }
  }

  res.status(502).json({ error: "All translation hosts failed" });
}
