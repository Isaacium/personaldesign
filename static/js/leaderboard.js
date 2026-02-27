// Leaderboard System for Hugo Games

const SECRET_KEY = "MaterialsScience_2026!"; // Client-side anti-cheat token

async function promptUsername() {
  let stored = localStorage.getItem('game_username');
  if (stored) return stored;

  let username = prompt("Welcome! Please enter a username for the leaderboard:");
  while (!username || username.trim().length === 0 || username.trim().length > 20) {
    if (username === null) return null; // User cancelled
    username = prompt("Please enter a valid username (1-20 characters):");
  }

  localStorage.setItem('game_username', username.trim());
  return username.trim();
}

// Convert ArrayBuffer to Hex string
function bufferToHex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

// Generate HMAC-SHA256 hash using Web Crypto API
async function generateSignature(username, score, game_id) {
  const encoder = new TextEncoder();
  const message = `${username}:${score}:${game_id}`;
  
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );

  return bufferToHex(signature);
}

async function submitScore(game_id, score) {
  const username = localStorage.getItem('game_username');
  if (!username) return;

  try {
    const hash = await generateSignature(username, score, game_id);

    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        score,
        game_id,
        hash
      })
    });

    if (!response.ok) {
      console.error("Score submission failed");
    }
  } catch (error) {
    console.error("Error submitting score:", error);
  }
}

async function fetchScores(game_id) {
  try {
    const response = await fetch(`/scores?game_id=${encodeURIComponent(game_id)}`);
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error("Error fetching scores:", error);
    return [];
  }
}

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(3);
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

// Render the leaderboard modal
async function showLeaderboard(game_id, containerId = "leaderboard-modal") {
  let modal = document.getElementById(containerId);
  if (!modal) {
    modal = document.createElement('div');
    modal.id = containerId;
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
      z-index: 1000; font-family: sans-serif;
    `;
    
    modal.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative;">
        <h2 style="margin-top: 0; text-align: center; color: #334155;">Top 10 Leaderboard</h2>
        <button id="${containerId}-close" style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
        <div id="${containerId}-content" style="margin-top: 1rem; min-height: 200px;">Loading...</div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById(`${containerId}-close`).onclick = () => {
      modal.style.display = 'none';
    };
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
  }

  modal.style.display = 'flex';
  const content = document.getElementById(`${containerId}-content`);
  content.innerHTML = '<div style="text-align: center; color: #64748b;">Loading scores...</div>';

  const scores = await fetchScores(game_id);

  if (scores.length === 0) {
    content.innerHTML = '<div style="text-align: center; color: #64748b; padding: 2rem;">No scores yet! Be the first!</div>';
    return;
  }

  let tableHtml = `
    <table style="width: 100%; border-collapse: collapse; text-align: left;">
      <thead>
        <tr style="border-bottom: 2px solid #e2e8f0;">
          <th style="padding: 0.75rem; color: #475569;">Rank</th>
          <th style="padding: 0.75rem; color: #475569;">Player</th>
          <th style="padding: 0.75rem; color: #475569; text-align: right;">Time</th>
        </tr>
      </thead>
      <tbody>
  `;

  scores.forEach((entry, index) => {
    // Assuming score is stored in ms. If stored in seconds, adjust as needed.
    const isCurrentUser = entry.username === localStorage.getItem('game_username');
    const rowStyle = isCurrentUser ? 'background-color: #f1f5f9; font-weight: bold;' : '';
    const formatted = formatTime(entry.score);
    
    tableHtml += `
      <tr style="border-bottom: 1px solid #e2e8f0; ${rowStyle}">
        <td style="padding: 0.75rem; color: #64748b;">#${index + 1}</td>
        <td style="padding: 0.75rem;">${entry.username}</td>
        <td style="padding: 0.75rem; text-align: right; font-family: monospace;">${formatted}</td>
      </tr>
    `;
  });

  tableHtml += `</tbody></table>`;
  content.innerHTML = tableHtml;
}

// Make sure it's accessible globally if needed by inline handlers
window.leaderboardSystem = { promptUsername, submitScore, showLeaderboard, formatTime };
