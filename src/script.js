// source for raycasting code: (Wael Yasmina) https://youtu.be/oQbfy8QP8Lc
//source for click event listener (Wael Yasmina)

import * as THREE from 'three'
import { MeshDepthMaterial } from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { VRButton } from 'three/addons/webxr/VRButton.js'
// Canvas
const canvas = document.querySelector('canvas.webgl') //create canvas using the webgl class specified in index.html

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
// Object
const geometry = new THREE.PlaneGeometry(100, 100)
const material = new THREE.MeshBasicMaterial({visible:false}) //creates an invisible 2d plane 
const mesh = new THREE.Mesh(geometry, material)

mesh.rotation.x -= Math.PI/2 //what is this part for?

const grid = new THREE.GridHelper(100, 100) //three.js class that adds a 2d grid to a given scene
scene.add(mesh)
mesh.name = 'floor'
scene.add(grid)


//Note: it looks like a square in the grid is 0.5/0.5
const highlight = new THREE.BoxGeometry(1,1,1) //creating the cursor
const highlight_mat = new THREE.MeshBasicMaterial({color: 'white', wireframe:true, side: THREE.DoubleSide}) //creating the material
const h_mesh = new THREE.Mesh(highlight, highlight_mat)
h_mesh.position.x = 0.5 //set the position in the grid
h_mesh.position.z = 0.5
scene.add(h_mesh)

//mouse hovering
// this is gonna be implemented using the raycaster class which is used for mouse picking 
//(raycasting is where you use 3d modeling/image rendering in order to cast virtual light onto objects in order to determine their position on a given plane)
//(ray tracting is where you model the lighting of a scene by rendering all the objects in a given scene)
const mouse_pos = new THREE.Vector2()
const raycaster = new THREE.Raycaster()
let intersects
let intersect_point_copy = new THREE.Vector3()

window.addEventListener('mousemove', function(e)
{ 
    mouse_pos.x = (e.clientX/window.innerWidth) *2 - 1 //calculates pointer position in normalized device coordinates
    //normalized device coordinates: screen independent display coordinate system in which x y and z are components from range -1 to 1 
    mouse_pos.y = -(e.clientY/window.innerHeight)*2 + 1 
    raycaster.setFromCamera(mouse_pos, camera) //updates the ray with a new origin and direction
    intersects = raycaster.intersectObjects(scene.children)  //checks for the intersection between the obejct 

    intersects.forEach(function(intersect) { 
        if(intersect.object.name === 'floor'){ //checking if the scene child intersected with is the first mesh
            const highlight_pos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5) //calculates the position of the intersection
            intersect_point_copy = highlight_pos
            h_mesh.position.set(highlight_pos.x, .5, highlight_pos.z) //sets position
        }
    })
})

window.addEventListener('click', function(e) 
{ 
    const box = new THREE.BoxGeometry(1,1,1)
    const mat = new THREE.MeshBasicMaterial({color:'white'})
    const box_mesh = new THREE.Mesh(box, mat)
    box_mesh.position.set(intersect_point_copy.x, 0.5, intersect_point_copy.z)
    scene.add(box_mesh)

})

window.addEventListener('resize', () =>
{

    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100)
camera.position.x = 5
camera.position.y = 5
camera.position.z = 5
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setAnimationLoop( function () {
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
})
const tick = () =>
{

}

tick()
