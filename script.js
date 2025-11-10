async function loadData(range = "daily") {
  const res = await fetch("data/progress.json");
  const data = await res.json();
  renderDashboard(data[range]);
}

function renderDashboard(dataset) {
  const skillsList = document.getElementById("skills-list");
  const charts = document.getElementById("charts");
  skillsList.innerHTML = "";
  charts.innerHTML = "";

  Object.keys(dataset).forEach(skill => {
    // Add sidebar item
    const li = document.createElement("li");
    li.textContent = skill;
    skillsList.appendChild(li);

    // Simple bar chart
    const section = document.createElement("div");
    section.className = "chart";
    section.innerHTML = `
      <h3>${skill}</h3>
      <div class="bars">
        ${dataset[skill].map(val => `<div class="bar" style="height:${val}px"></div>`).join("")}
      </div>`;
    charts.appendChild(section);
  });
}

document.querySelectorAll(".time-toggle button").forEach(btn => {
  btn.addEventListener("click", e => {
    document.querySelectorAll(".time-toggle button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    loadData(e.target.dataset.range);
  });
});

loadData();
