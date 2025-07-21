// app/api/exchange/route.js

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return new Response(JSON.stringify({ error: "Missing 'from' or 'to' parameter" }), {
      status: 400,
    });
  }

  const API_KEY = "8a85a7c833885550cad71bae";
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const rate = data?.conversion_rates?.[to];
    if (!rate) {
      return new Response(JSON.stringify({ error: `Conversion rate not found for ${to}` }), {
        status: 404,
      });
    }

    return Response.json({ rate });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch exchange rate", details: error.message }), {
      status: 500,
    });
  }
}
