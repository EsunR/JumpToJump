export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  init() {
    console.log('game page init');
    var width = window.innerWidth;
    var height = window.innerHeight;

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas
    })

    // 创建一个scene，并将其挂载到对象上
    var scene = new THREE.Scene()
    this.scene = scene

    // 创建一个坐标 helper
    var axesHelper = new THREE.AxisHelper(100)
    scene.add(axesHelper)

    // 使用正交相机（没有透视效果）,定义空间范围（上下左右前后）
    var camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -1000, 1000)

    renderer.setClearColor(new THREE.Color(0x000000))
    renderer.setSize(width, height)

    // 创建一个 Shap Geometries（几何形状）
    var triangleShape = new THREE.Shape()
    // 绘制一个三角形
    triangleShape.moveTo(0, 100)
    triangleShape.lineTo(-100, -100)
    triangleShape.lineTo(100, -100)

    // 创建一个几何体
    var geometry = new THREE.ShapeGeometry(triangleShape)
    // 创建一个绘制的材质 （MeshBasicMaterial可以不接受光照就将原始的图像绘制出来）
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      // side 默认只有一面
      side: THREE.DoubleSide
    })

    // geometry相当于顶点着色器中的坐标情况，material相当于片元着色器中定义的色彩信息
    var mesh = new THREE.Mesh(geometry, material)
    this.mesh = mesh
    mesh.position.x = 0
    mesh.position.y = 0
    mesh.position.z = 1
    scene.add(mesh)

    // 相机由 (0,0,0) 的坐标望向 (0,0,1) 的坐标
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 0
    camera.lookAt(new THREE.Vector3(0, 0, 1))

    var currentAngle = 0
    var lastTimestamp = Date.now()
    var animate = function () {
      var now = Date.now()
      var duration = now - lastTimestamp
      lastTimestamp = now
      currentAngle = currentAngle + duration / 1000 * Math.PI
    }

    var render = function () {
      animate()
      mesh.rotation.set(0, currentAngle, 0);
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    render()

    renderer.render(scene, camera)

    setTimeout(() => {
      this.callbacks.showGameOverPage()
    }, 2000);
  }

  restart() {
    console.log('game page restart');
  }

  show() {
    this.mesh.visible = true
  }

  hide() {
    this.mesh.visible = false
  }
}