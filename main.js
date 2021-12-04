import {
  AxesHelper,
  BoxBufferGeometry,
  BufferGeometry,
  Float32BufferAttribute,
  MathUtils,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TextureLoader,
  WebGLRenderer,
  VertexColors,
  Group,
  Clock,
  LineBasicMaterial,
  Line,
  Mesh,
  SphereBufferGeometry,
  MeshNormalMaterial,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./style.css";

const textureLoader = new TextureLoader();
// const circleTexture = textureLoader.load("/circle.png");
const alphaMap = textureLoader.load("/alphamap.png");

const scene = new Scene();
const count = 300;
const distance = 4;
const size = 0.2;

// scene.add(new AxesHelper());

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

camera.position.z = 2;
camera.position.y = 0.5;
camera.position.x = 0.5;
scene.add(camera);

const points = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < points.length; i++) {
  points[i] = MathUtils.randFloatSpread(distance * 2);
  colors[i] = Math.random() * 0.5 + 0.5;
}

const geometry = new BufferGeometry();
geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
const pointMaterial = new PointsMaterial({
  size,
  vertexColors: VertexColors,
  alphaMap,
  alphaTest: 0.5,
  transparent: true,
});
const pointsObject = new Points(geometry, pointMaterial);
const group = new Group();
group.add(pointsObject);

const lineMaterial = new LineBasicMaterial({
  color: 0x000000,
  opacity: 0.05,
  depthTest: false,
});
const lineObject = new Line(geometry, lineMaterial);

group.add(lineObject);

// group.add(new Mesh(new SphereBufferGeometry(1, 23), new MeshNormalMaterial()));

scene.add(group);

const renderer = new WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
const clock = new Clock();

let mouseX = 0;
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
});

function tick() {
  const time = clock.getElapsedTime();
  renderer.render(scene, camera);
  // controls.update();
  requestAnimationFrame(tick);
  //   group.rotation.y = time * 0.1;
  const ratio = (mouseX / window.innerWidth - 0.5) * 2;
  group.rotation.y = ratio * Math.PI * 0.1;
}

tick();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
