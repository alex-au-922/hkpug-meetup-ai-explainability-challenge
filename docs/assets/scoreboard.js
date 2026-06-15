async function loadScoreboard() {
  const table = document.querySelector("#scoreboard-table tbody");
  if (!table) return;

  try {
    const response = await fetch("../assets/leaderboard.json");
    const rows = await response.json();
    table.innerHTML = "";

    rows
      .sort((a, b) => b.score - a.score || a.participant_id.localeCompare(b.participant_id))
      .forEach((row, index) => {
        const tr = document.createElement("tr");
        const percent = Math.round((row.score / row.max_score) * 100);
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td><strong>${row.display_name || row.participant_id}</strong><br><span>${row.participant_id}</span></td>
          <td>${row.score}/${row.max_score} (${percent}%)</td>
          <td>${row.tier}</td>
          <td>${row.updated_at}</td>
        `;
        table.appendChild(tr);
      });
  } catch (error) {
    table.innerHTML = `<tr><td colspan="5">Scoreboard is not available yet.</td></tr>`;
  }
}

loadScoreboard();
