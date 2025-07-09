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
