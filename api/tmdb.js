const TMDB_BASE = "https://api.themoviedb.org/3";

export default async function handler(req, res) {
  const { url } = req;
  const path = url.replace(/^\/api\/tmdb/, "") || "/";
  const target = `${TMDB_BASE}${path}`;

  try {
    const response = await fetch(target, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await response.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
    res.status(response.status).send(data);
  } catch (error) {
    res.status(502).json({ error: "Failed to proxy request to TMDB API" });
  }
}
