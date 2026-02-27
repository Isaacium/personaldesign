export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const game_id = url.searchParams.get('game_id');

    if (!game_id) {
      return new Response(JSON.stringify({ error: 'Missing game_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = env.DB;
    
    // For racing/speedrun games, lower score (time) is better.
    // So we sort ascending by score.
    const { results } = await db.prepare(
      "SELECT username, score, updated_at FROM leaderboard WHERE game_id = ? ORDER BY score ASC LIMIT 10"
    ).bind(game_id).all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
