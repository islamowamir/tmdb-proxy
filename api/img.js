const IMG_BASE = "https://image.tmdb.org/t/p";

export default async function handler(req, res) {
  const { url } = req;
  const path = url.replace(/^\/api\/img/, "") || "/";
  const target = `${IMG_BASE}${path}`;

  try {
    const response = await fetch(target);

    if (!response.ok) {
      return res.status(response.status).end();
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.status(200).send(buffer);
  } catch (error) {
    res.status(502).json({ error: "Failed to proxy image from TMDB" });
  }
}
