// avatar.js - prosty humanoid 3D z możliwością zmiany kapeluszy, wąsów i ubrań

let scene, camera, renderer;
let avatarGroup;
let hats = {};
let mustaches = {};
let clothes = {};

init();
animate();

function init() {
  const container = document.getElementById('container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.8, 3);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // światło
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 10);
  scene.add(light);

  // ambient light
  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  // grupa avatar
  avatarGroup = new THREE.Group();
  scene.add(avatarGroup);

  // Ciało (prosty cylinder)
  const bodyGeom = new THREE.CylinderGeometry(0.4, 0.5, 1.5, 32);
  const bodyMat = new THREE.MeshStandardMaterial({color: 0x0077ff});
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = 0.75;
  avatarGroup.add(body);
  clothes['casual'] = body;

  // Głowa (kula)
  const headGeom = new THREE.SphereGeometry(0.35, 32, 32);
  const headMat = new THREE.MeshStandardMaterial({color: 0xffcc99});
  const head = new THREE.Mesh(headGeom, headMat);
  head.position.y = 1.85;
  avatarGroup.add(head);

  // Tworzymy nakrycia głowy - ukryte na start
  hats['cylinder'] = createCylinderHat();
  hats['cylinder'].visible = false;
  avatarGroup.add(hats['cylinder']);

  hats['pirate'] = createPirateHat();
  hats['pirate'].visible = false;
  avatarGroup.add(hats['pirate']);

  hats['crown'] = createCrown();
  hats['crown'].visible = false;
  avatarGroup.add(hats['crown']);

  hats['cowboy'] = createCowboyHat();
  hats['cowboy'].visible = false;
  avatarGroup.add(hats['cowboy']);

  // Wąsy
  mustaches['short'] = createMustache(0.15, 0.05, 0.02, 0xff5500);
  mustaches['short'].visible = false;
  avatarGroup.add(mustaches['short']);

  mustaches['long'] = createMustache(0.25, 0.07, 0.02, 0x663300);
  mustaches['long'].visible = false;
  avatarGroup.add(mustaches['long']);

  mustaches['curly'] = createCurlyMustache();
  mustaches['curly'].visible = false;
  avatarGroup.add(mustaches['curly']);

  // Ubrania - na razie tylko zmiana koloru ciała (dla uproszczenia)
  clothes['santa'] = new THREE.MeshStandardMaterial({color: 0xff0000});
  clothes['bunny'] = new THREE.MeshStandardMaterial({color: 0xffffff});
  clothes['dino'] = new THREE.MeshStandardMaterial({color: 0x228822});

  // Obsługa UI
  document.getElementById('hatSelect').addEventListener('change', e => {
    setHat(e.target.value);
  });

  document.getElementById('mustacheSelect').addEventListener('change', e => {
    setMustache(e.target.value);
  });

  document.getElementById('clothesSelect').addEventListener('change', e => {
    setClothes(e.target.value);
  });

  window.addEventListener('resize', onWindowResize, false);
}

function createCylinderHat() {
  const hatGroup = new THREE.Group();
  // Cylinder jako kapelusz
  const baseGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
  const baseMat = new THREE.MeshStandardMaterial({color: 0x000000});
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.set(0, 2.1, 0);
  hatGroup.add(base);
  // rondo kapelusza
  const brimGeom = new THREE.CylinderGeometry(0.45, 0.45, 0.05, 32);
  const brimMat = new THREE.MeshStandardMaterial({color: 0x000000});
  const brim = new THREE.Mesh(brimGeom, brimMat);
  brim.position.set(0, 2, 0);
  hatGroup.add(brim);
  return hatGroup;
}

function createPirateHat() {
  const hatGroup = new THREE.Group();
  // Prosty kapelusz pirata z trójkątów
  const geometry = new THREE.ConeGeometry(0.45, 0.3, 3);
  const material = new THREE.MeshStandardMaterial({color: 0x222222});
  const cone = new THREE.Mesh(geometry, material);
  cone.position.set(0, 2.1, 0);
  cone.rotation.y = Math.PI / 2;
  hatGroup.add(cone);
  return hatGroup;
}

function createCrown() {
  const crownGroup = new THREE.Group();
  const baseGeom = new THREE.TorusGeometry(0.4, 0.08, 16, 100);
  const baseMat = new THREE.MeshStandardMaterial({color: 0xffd700});
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.set(0, 2.05, 0);
  base.rotation.x = Math.PI / 2;
  crownGroup.add(base);
  // Dodaj kilka szpiców jako stożki
  for(let i=0; i<5; i++) {
    const spikeGeom = new THREE.ConeGeometry(0.07, 0.2, 8);
    const spikeMat = new THREE.MeshStandardMaterial({color: 0xffd700});
    const spike = new THREE.Mesh(spikeGeom, spikeMat);
    const angle = i * (2*Math.PI / 5);
    spike.position.set(Math.cos(angle)*0.35, 2.2, Math.sin(angle)*0.35);
    crownGroup.add(spike);
  }
  return crownGroup;
}

function createCowboyHat() {
  const hatGroup = new THREE.Group();
  // Cylinder jako główna część kapelusza
  const mainGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 32);
  const mainMat = new THREE.MeshStandardMaterial({color: 0x654321});
  const main = new THREE.Mesh(mainGeom, mainMat);
  main.position.set(0, 2.1, 0);
  hatGroup.add(main);
  // rondo kapelusza
  const brimGeom = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
  const brimMat = new THREE.MeshStandardMaterial({color: 0x654321});
  const brim = new THREE.Mesh(brimGeom, brimMat);
  brim.position.set(0, 2, 0);
  brim.rotation.x = Math.PI / 2;
  hatGroup.add(brim);
  return hatGroup;
}

function createMustache(width, height, depth, color) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({color: color});
  const mustache = new THREE.Mesh(geometry, material);
  mustache.position.set(0, 1.55, 0.35);
  return mustache;
}

function createCurlyMustache() {
  const group = new THREE.Group();
  // Proste zakręcone wąsy z półkoli
  for(let side of [-1,1]) {
    const geometry = new THREE.TorusGeometry(0.1, 0.02, 16, 100, Math.PI/2);
    const material = new THREE.MeshStandardMaterial({color: 0x663300});
    const torus = new THREE.Mesh(geometry, material);
    torus.position.set(side*0.12, 1.53, 0.35);
    torus.rotation.z = side * Math.PI / 2;
    group.add(torus);
  }
  return group;
}

function setHat(name) {
  for(let key in hats) {
    hats[key].visible = false;
  }
  if(hats[name]) hats[name].visible = true;
}

function setMustache(name) {
  for(let key in mustaches) {
    mustaches[key].visible = false;
  }
  if(mustaches[name]) mustaches[name].visible = true;
}

function setClothes(name) {
  // Dla uproszczenia zmienia kolor ciała i głowy
  let bodyMat = clothes['casual'].material;
  let headMat = avatarGroup.children.find(m => m.geometry.type === "SphereGeometry").material;
  
  switch(name) {
    case 'santa':
      bodyMat.color.set(0xff0000);
      headMat.color.set(0xffccbb);
      break;
    case 'bunny':
      bodyMat.color.set(0xffffff);
      headMat.color.set(0xfff8e7);
      break;
    case 'dino':
      bodyMat.color.set(0x228822);
      headMat.color.set(0xffcc99);
      break;
    default:
      bodyMat.color.set(0x0077ff);
      headMat.color.set(0xffcc99);
  }
}

function onWindowResize() {
  const container = document.getElementById('container');
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);
  avatarGroup.rotation.y += 0.005;
  renderer.render(scene, camera);
}

// Przykładowa budowa ciała i głowy (z mojego kodu):
const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 1;

const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc99 });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.y = 2.3;

const avatarGroup = new THREE.Group();
avatarGroup.add(body);
avatarGroup.add(head);
scene.add(avatarGroup);
