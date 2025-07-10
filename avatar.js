// Dla każdego „part” podaj ile masz plików w folderze assets/<part>/
const CONFIG = {
  body: 3,
  eyes: 3,
  hat: 3
};

const state = {
  body: 1,
  eyes: 1,
  hat: 1
};

function updateLayer(part) {
  const idx = state[part];
  const el = document.querySelector(`#${part}-layer img`);
  el.src = `assets/${part}/${part}${idx}.png`;
}

// ustawiamy początkowe obrazki
Object.keys(state).forEach(p => {
  const container = document.getElementById(`${p}-layer`);
  // dodajemy <img> do warstwy
  const img = document.createElement('img');
  container.appendChild(img);
  updateLayer(p);
});

// obsługa strzałek
document.querySelectorAll('.control-group button').forEach(btn => {
  btn.addEventListener('click', () => {
    const part = btn.dataset.part;
    const dir  = parseInt(btn.dataset.dir, 10);
    let n = state[part] + dir;
    if (n < 1) n = CONFIG[part];
    if (n > CONFIG[part]) n = 1;
    state[part] = n;
    updateLayer(part);
  });
});
