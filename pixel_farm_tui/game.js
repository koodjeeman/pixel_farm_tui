
let language = "th";
let npcData = [];

function switchLanguage() {
  language = language === "th" ? "en" : "th";
  drawNPCs();
}

async function loadNPCs() {
  const res = await fetch("npc.json");
  npcData = await res.json();
  drawNPCs();
}

function drawNPCs() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  npcData.forEach((npc, i) => {
    const img = new Image();
    img.src = "assets/npc/" + npc.sprite;
    img.onload = () => {
      ctx.drawImage(img, 50 + i * 80, 100, 32, 32);
      ctx.font = "12px sans-serif";
      ctx.fillText(npc.dialogues[language][0], 50 + i * 80, 150);
    }
  });
}

window.onload = loadNPCs;
