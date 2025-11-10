let currentRange = "daily";
let progressData = {};

async function loadData(range = "daily") {
  const local = localStorage.getItem("progressData");
  progressData = local ? JSON.parse(local) : await (await fetch("data/progress.json")).json();
  currentRange = range;
  populateSkillSelect();
  renderDashboard(progressData[range]);
}

function populateSkillSelect() {
  const select = document.getElementById("skill-select");
  select.innerHTML = "";
  Object.keys(progressData[currentRange]).forEach(skill => {
    const option = document.createElement("option");
    option.value = skill;
    option.textContent = skill;
    select.appendChild(option);
  });
}

function renderDashboard(dataset) {
  const charts = document.getElementById("charts");
  charts.innerHTML = "";

  Object.keys(dataset).forEach(skill => {
    const section = document.createElement("div");
    section.className = "chart";
    section.innerHTML = `
      <h3>${skill}</h3>
      <div class="bars">
        ${dataset[skill].map(val => `<div class="bar" style="height:${val}px"></div>`).join("")}
      </div>
      <button class="delete-skill" data-skill="${skill}">Delete</button>
    `;
    charts.appendChild(section);
  });

  document.querySelectorAll(".delete-skill").forEach(btn => {
    btn.addEventListener("click", () => {
      const skill = btn.dataset.skill;
      delete progressData[currentRange][skill];
      localStorage.setItem("progressData", JSON.stringify(progressData));
      populateSkillSelect();
      renderDashboard(progressData[currentRange]);
    });
  });
}

document.getElementById("add-progress").addEventListener("click", () => {
  const skill = document.getElementById("skill-select").value;
  const newVal = parseInt(document.getElementById("progress-value").value);
  if (!skill || isNaN(newVal)) return alert("Please select a skill and enter a value!");

  progressData[currentRange][skill].push(newVal);
  localStorage.setItem("progressData", JSON.stringify(progressData));
  renderDashboard(progressData[currentRange]);
});

document.getElementById("add-skill").addEventListener("click", () => {
  const newSkill = prompt("Enter new skill name:");
  if (!newSkill) return;
  if (!progressData[currentRange][newSkill]) {
    progressData[currentRange][newSkill] = [];
    localStorage.setItem("progressData", JSON.stringify(progressData));
    populateSkillSelect();
    renderDashboard(progressData[currentRange]);
  } else {
    alert("Skill already exists!");
  }
});

document.getElementById("export-data").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(progressData)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "progressData.json";
  a.click();
});

document.querySelectorAll(".time-toggle button").forEach(btn => {
  btn.addEventListener("click", e => {
    document.querySelectorAll(".time-toggle button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    loadData(e.target.dataset.range);
  });
});

loadData();
