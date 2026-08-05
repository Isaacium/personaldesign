export async function onRequestGet({ env }) {
  try {
    const db = env.INVITES_DB || env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database binding (INVITES_DB / DB) not found.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { results } = await db.prepare("SELECT bracket_data FROM brackets").all();

    if (!results || results.length === 0) {
      return new Response(JSON.stringify({ total_brackets: 0, matchups: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Tally votes per match key
    // match keys: r1m0, r1m1, r1m2, r1m3, r2m0, r2m1, final
    const matchTallies = {};

    results.forEach(row => {
      try {
        const data = typeof row.bracket_data === 'string' ? JSON.parse(row.bracket_data) : row.bracket_data;
        if (data && typeof data === 'object') {
          Object.keys(data).forEach(matchKey => {
            const winner = data[matchKey];
            if (!winner) return;

            // Handle object or string
            const winnerName = typeof winner === 'object' ? winner.name : winner;

            if (!matchTallies[matchKey]) {
              matchTallies[matchKey] = {};
            }
            matchTallies[matchKey][winnerName] = (matchTallies[matchKey][winnerName] || 0) + 1;
          });
        }
      } catch (e) {
        // Skip invalid JSON
      }
    });

    // Compute majority winner for each match key
    const matchups = {};
    Object.keys(matchTallies).forEach(matchKey => {
      const votes = matchTallies[matchKey];
      let topPick = null;
      let maxVotes = -1;

      Object.keys(votes).forEach(flavor => {
        if (votes[flavor] > maxVotes) {
          maxVotes = votes[flavor];
          topPick = flavor;
        }
      });

      matchups[matchKey] = {
        majorityWinner: topPick,
        votes: votes,
        totalVotes: Object.values(votes).reduce((a, b) => a + b, 0)
      };
    });

    return new Response(JSON.stringify({
      total_brackets: results.length,
      matchups: matchups
    }), {
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
