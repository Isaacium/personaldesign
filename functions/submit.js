export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { username, score, game_id, hash } = data;

    if (!username || typeof score !== 'number' || !game_id || !hash) {
      return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!env.SCORE_SECRET) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify HMAC-SHA256
    const message = `${username}:${score}:${game_id}`;
    
    // Import the secret key
    const encoder = new TextEncoder();
    const keyData = encoder.encode(env.SCORE_SECRET);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    // Verify the signature
    const signatureArray = hexToArrayBuffer(hash);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureArray,
      encoder.encode(message)
    );

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Handle the database operation
    // We want to insert or update the score only if the new score is *lower* (faster time)
    // We can query the existing score first
    const db = env.DB;
    
    const existing = await db.prepare(
      "SELECT score FROM leaderboard WHERE game_id = ? AND username = ?"
    ).bind(game_id, username).first();

    if (existing) {
      if (score < existing.score) {
        // New score is better (lower time)
        await db.prepare(
          "UPDATE leaderboard SET score = ?, updated_at = CURRENT_TIMESTAMP WHERE game_id = ? AND username = ?"
        ).bind(score, game_id, username).run();
      }
    } else {
      // Insert new score
      await db.prepare(
        "INSERT INTO leaderboard (game_id, username, score) VALUES (?, ?, ?)"
      ).bind(game_id, username, score).run();
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Helper to convert hex string back to ArrayBuffer
function hexToArrayBuffer(hex) {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
}
