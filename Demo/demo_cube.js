/** @type {HTMLCanvasElement} */
var canvas = document.getElementById('myCanvas')
var gl = canvas.getContext('webgl')
var program = gl.createProgram()
var VSHADER_SOURCE, FSHADER_SOURCE

// a_Position 原始坐标
// a_Color 颜色信息
// a_Normal 每个顶点的法向量
// u_MvpMatrix 是在js环境中计算好的 ModelMatrix ViewMatrix ProjectionMatrix 相乘结果
VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute vec4 a_Normal;
  uniform mat4 u_MvpMatrix;
  void main(){
    gl_Position = u_MvpMatrix * a_Position;
  }
`



FSHADER_SOURCE = `
  void main(){
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

var vertexShader, fragmentShader

// shader 应该包含两部分，一部分是 context WebGL api 定义出来 shader ，第二部分是 shader 本身的代码
function createShader(gl, sourceCode, type) {
  // 创建 shader
  var shader = gl.createShader(type)
  gl.shaderSource(shader, sourceCode)
  gl.compileShader(shader)
  return shader
}

// 定义 vertex shader
vertexShader = createShader(gl, VSHADER_SOURCE, gl.VERTEX_SHADER)

// 定义 frament shader
fragmentShader = createShader(gl, FSHADER_SOURCE, gl.FRAGMENT_SHADER)

//  添加 shader 到 program
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)

// 连接 program 到 context
gl.linkProgram(program)
gl.useProgram(program)
gl.program = program

var tick = function () {
  draw()
  requestAnimationFrame(tick)
}

// 对各种bffer进行创建并传入到shader中
function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  // 顶点
  var vertices = new Float32Array([   // Vertex coordinates
    1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0,    // v0-v1-v2-v3 front
    1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0,    // v0-v3-v4-v5 right
    1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
    -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0,    // v1-v6-v7-v2 left
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,    // v7-v4-v3-v2 down
    1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0     // v4-v7-v6-v5 back
  ]);

  // 每个顶点的法向量
  var normals = new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0
  ]);

  var colors = new Float32Array([     // Colors
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v1-v2-v3 front(white)
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v3-v4-v5 right(white)
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v0-v5-v6-v1 up(white)
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v1-v6-v7-v2 left(white)
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,  // v7-v4-v3-v2 down(white)
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0   // v4-v7-v6-v5 back(white)
  ]);

  var indices = new Uint8Array([       // Indices of the vertices
    0, 1, 2, 0, 2, 3,    // front
    4, 5, 6, 4, 6, 7,    // right
    8, 9, 10, 8, 10, 11,    // up
    12, 13, 14, 12, 14, 15,    // left
    16, 17, 18, 16, 18, 19,    // down
    20, 21, 22, 20, 22, 23     // back
  ]);

  initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')
  initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')
  initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')

  // 单独创建一个索引的 Buffer
  var indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  return indices.length;
}

function initArrayBuffer(gl, data, num, type, attribute) {
  // 创建一个 buffer
  var buffer = gl.createBuffer()
  if (!buffer) {
    console.log('Failed to create the buffer object')
    return false
  }
  // 传输二进制通常使用 ARRAY_BUFFER 
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

  // 获取 shader 中变量的地址
  var a_attribute = gl.getAttribLocation(gl.program, attribute)
  if (a_attribute < 0) {
    console.log('Failed to get stroage location of ' + attribute)
    return false
  }

  // 解析数据格式
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0)

  // 传递数据
  gl.enableVertexAttribArray(a_attribute)

  // 将之前绑定的 buffer 卸载
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  return true
}



// js 通过 buffer 向 shader 中传递相关数据
// 将顶点位置传递到 vertex shader 中
var n = initVertexBuffers(gl)
gl.clearColor(0, 0, 0, 1)

gl.enable(gl.DEPTH_TEST) // 开启深度检测


var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix')
var mvpMatrix = new Matrix4()
// 设置透视投影
mvpMatrix.setPerspective(30, 1, 1, 100)
// 望向主体
mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0)
gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)

// 绘制
function draw() {
  // 清空当前场景
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  // 绘制三角形面片
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}


tick()