export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { name, email, attending, bracket_data } = data;

    if (!name || !email || typeof attending === 'undefined') {
      return new Response(JSON.stringify({ error: 'Name, email, and attending status are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const db = env.INVITES_DB || env.DB;
    if (!db) {
      return new Response(JSON.stringify({ error: 'Database binding (INVITES_DB / DB) not found.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Insert RSVP
    const isAttending = attending ? 1 : 0;
    const rsvpResult = await db.prepare(
      "INSERT INTO rsvps (name, email, attending) VALUES (?, ?, ?)"
    ).bind(name, email, isAttending).run();

    const rsvpId = rsvpResult.meta.last_row_id;

    // If attending and bracket_data provided, insert bracket
    if (isAttending && bracket_data) {
      const bracketStr = typeof bracket_data === 'string' ? bracket_data : JSON.stringify(bracket_data);
      await db.prepare(
        "INSERT INTO brackets (rsvp_id, bracket_data) VALUES (?, ?)"
      ).bind(rsvpId, bracketStr).run();
    }

    return new Response(JSON.stringify({ success: true, rsvp_id: rsvpId }), {
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
