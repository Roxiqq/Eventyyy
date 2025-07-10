// Proste cykliczne zmiany avatara: twarz już jest, potem czapka, wąsy, oba, wylaczone
const avatar = document.getElementById('avatar');
const hat     = document.getElementById('hat');
const mustache= document.getElementById('mustache');
const face    = avatar.querySelector('.face');

const skins = [
  { color:'#ffc107', hat:false, mustache:false },
  { color:'#8e44ad', hat:true,  mustache:false },
  { color:'#2ecc71', hat:false, mustache:true  },
  { color:'#e67e22', hat:true,  mustache:true  },
];
let idx = 0;

function applySkin(i){
  const s = skins[i];
  face.style.background = s.color;
  hat.style.display      = s.hat      ? 'block' : 'none';
  mustache.style.display = s.mustache ? 'block' : 'none';
}

document.getElementById('skinBtn').onclick = ()=>{
  idx = (idx+1) % skins.length;
  applySkin(idx);
};

// inicjalnie
applySkin(0);
