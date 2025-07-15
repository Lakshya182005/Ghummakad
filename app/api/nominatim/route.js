// app/api/nominatim/route.js
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  if (!q)
    return new Response(JSON.stringify({ error: "Missing query" }), {
      status: 400
    });

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      q
    )}`,
    {
      headers: {
        "User-Agent": "Ghummakad"
      }
    }
  );

  const data = await response.json();
  return Response.json(data);
}
