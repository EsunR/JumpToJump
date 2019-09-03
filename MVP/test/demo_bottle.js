var width = 400;
var height = 400;
var canvas = document.getElementById("demo-canvas");
var renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(400, 400)
var scene = new THREE.Scene()
var basicMaterial = new THREE.MeshPhongMaterial()

// 相机
var camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -1000, 1000)
camera.position.set(100, 0, 0)
camera.lookAt(0, 0, 0)
scene.add(camera)

// 坐标
var axesHelper = new THREE.AxesHelper(100)
scene.add(axesHelper)

// 主体
var bottle = new THREE.Object3D()
var head = new THREE.Mesh(
  new THREE.BoxGeometry(50, 50, 50),
  basicMaterial
)
head.position.y = 25
bottle.add(head)

var body = new THREE.Mesh(
  new THREE.ConeBufferGeometry(30, 100, 8),
  basicMaterial
)
bottle.add(body)

scene.add(bottle)




// 光线
var ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
var shadowLight = new THREE.DirectionalLight(0xffffff, 0.3)
shadowLight.position.set(100, 100, 100)
scene.add(ambientLight)
var shadowLight = new THREE.DirectionalLight(0xffffff, 0.3)
shadowLight.position.set(10, 30, 20)
shadowLight.target = bottle
scene.add(shadowLight)

var boxHelper = new THREE.BoxHelper(bottle, 0xffff00)
scene.add(boxHelper)

bottle.rotateX(1)
bottle.position.y = 52
bottle.position.z = 25


function animate() {
  renderer.render(scene, camera)

  requestAnimationFrame(animate)
}

animate()

