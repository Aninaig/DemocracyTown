import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7BD9F6);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const canvas = document.getElementById("newCanvas");
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.setSize( sizes.width, sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
//document.body.appendChild( renderer.domElement );

const modalContent = {
    "Haus":{
title: "Antwort #1",
content: "Gianina(22) wünscht sich mehr bezahlbaren Wohnraum",
    },
    "Bauarbeiter":{
title: "Antwort #2",
content: "Michael(54) wünscht sich das die Infrastruktur besser instand gehalten wird",
    },
    "Arzt":{
title: "Antwort #3",
content: "Patricia(53) wünscht sich bessere ärztliche Versorgung"
    }
};

const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalContentWrapper = document.querySelector(".modal-content-wrapper");
const modalExit = document.querySelector(".modal-exit-button");

//let modal = document.querySelector(".modal");

//let mouseModal = (e) => {
   // let x = e.clientX;
   // let y = e.clientY;
   // modal.style.top = y -150 + "px";
   // modal.style.left = x + "px";
   // document.querySelector(".hidden").style.display = "inline";
//}

//document.addEventListener("click", (e) => {
    //mouseModal(e);
//})

function showModal(id){
    const content = modalContent[id];
    if (content){
        modalTitle.textContent = content.title;
        modalContentWrapper.textContent = content.content;
        modal.classList.toggle("hidden");
    }
}

function hideModal(){
    modal.classList.toggle("hidden");
}

let intersectObject = "";
const intersectObjects = [];
const intersectObjectsNames = [
    "Haus",
    "Straße",
    "Bauarbeiter",
    "Arzt",
];



const loader = new GLTFLoader();

loader.load( "./ground5.glb", function ( glb ) {
  glb.scene.traverse((child) => {
    if(intersectObjectsNames.includes(child.name)){
        intersectObjects.push(child);
    }
    if(child.isMesh){
        child.castShadow = true;
        child.receiveShadow = true;
    }
  }
)
  scene.add( glb.scene );

}, undefined, function ( error ) {

  console.error( error );

} );

const sunlight = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
scene.add( sunlight );
//const helper = new THREE.DirectionalLightHelper( sunlight, 5 );
//scene.add( helper );


const light = new THREE.AmbientLight( 0x404040, 3 );
scene.add( light );

const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );

camera.position.x = 1.4;
camera.position.y = 0.5;
camera.position.z = 1.5;

const controls = new OrbitControls(camera, canvas);
controls.update;

function handleResize(){
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize( sizes.width, sizes.height );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onClick(){
    if(intersectObject !==""){
        showModal(intersectObject);
    }
    
}

function onPointerMove( event ){
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

modalExit.addEventListener("click", hideModal);
window.addEventListener("resize", handleResize);
window.addEventListener("click", onClick);
window.addEventListener("pointermove", onPointerMove);

function animate( time ) {
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(intersectObjects);

    if(intersects.length > 0){
        document.body.style.cursor = "pointer";
    }else{
        document.body.style.cursor = "default";
        intersectObject = "";
    }

    for (let i=0; i<intersects.length; i++){
        intersectObject = intersects[0].object.parent.name;
    }

    renderer.render( scene, camera );
    console.log(camera.position);
  }
  renderer.setAnimationLoop( animate );