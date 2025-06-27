const TILE_SIZE = 32;
const mapContainer = document.getElementById('game-container');

let mapData = null;
let npcs = [];

function loadJSON(url) {
  return fetch(url).then(res => res.json());
}

function createNpcElement(npc) {
  const el = document.createElement('img');
  el.src = `assets/npc/${npc.sprite}`;
  el.className = 'npc';
  el.style.left = npc.x * TILE_SIZE + 'px';
  el.style.top = npc.y * TILE_SIZE + 'px';

  const dialogueBox = document.createElement('div');
  dialogueBox.className = 'dialogue-box';
  dialogueBox.style.display = 'none';
  el.dialogueBox = dialogueBox;
  el.appendChild(dialogueBox);

  el.addEventListener('click', () => {
    const lines = npc.dialogue;
    const line = lines[Math.floor(Math.random() * lines.length)];
    dialogueBox.textContent = line;
    dialogueBox.style.display = 'block';
    setTimeout(() => {
      dialogueBox.style.display = 'none';
    }, 3000);
  });

  return el;
}

function renderMap() {
  mapContainer.innerHTML = '';
  for (let y = 0; y < mapData.height; y++) {
    for (let x = 0; x < mapData.width; x++) {
      const tile = document.createElement('div');
      tile.style.width = TILE_SIZE + 'px';
      tile.style.height = TILE_SIZE + 'px';
      tile.style.position = 'absolute';
      tile.style.left = x * TILE_SIZE + 'px';
      tile.style.top = y * TILE_SIZE + 'px';
      tile.style.backgroundColor = mapData.tiles[y][x] === 1 ? '#4a7030' : '#a9d18e';
      mapContainer.appendChild(tile);
    }
  }
}

function moveNpcRandomly(npc, el) {
  const directions = [
    {dx: 0, dy: -1},
    {dx: 0, dy: 1},
    {dx: -1, dy: 0},
    {dx: 1, dy: 0},
    {dx: 0, dy: 0}
  ];
  const dir = directions[Math.floor(Math.random() * directions.length)];
  const newX = npc.x + dir.dx;
  const newY = npc.y + dir.dy;

  if (newX >= 0 && newX < mapData.width &&
      newY >= 0 && newY < mapData.height &&
      mapData.tiles[newY][newX] === 0) {
    npc.x = newX;
    npc.y = newY;
    el.style.left = npc.x * TILE_SIZE + 'px';
    el.style.top = npc.y * TILE_SIZE + 'px';
  }
}

function startNpcBehavior(npc, el) {
  setInterval(() => {
    moveNpcRandomly(npc, el);
  }, npc.behavior.walkInterval);

  setInterval(() => {
    if (Math.random() < npc.behavior.talkChance) {
      const lines = npc.dialogue;
      const line = lines[Math.floor(Math.random() * lines.length)];
      el.dialogueBox.textContent = line;
      el.dialogueBox.style.display = 'block';
      setTimeout(() => {
        el.dialogueBox.style.display = 'none';
      }, 3000);
    }
  }, 8000);
}

async function init() {
  mapData = await loadJSON('map.json');
  npcs = await loadJSON('npc.json');
  renderMap();

  for (const npc of npcs) {
    const el = createNpcElement(npc);
    mapContainer.appendChild(el);
    startNpcBehavior(npc, el);
  }
}

init();