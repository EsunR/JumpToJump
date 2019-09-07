export default {
  pointInPolygon(point, vs) {
    var x = point[0], y = point[1]

    var inside = false

    const xMin = vs[0][0] > vs[2][0] ? vs[2][0] : vs[0][0]
    const xMax = vs[0][0] < vs[2][0] ? vs[2][0] : vs[0][0]

    const yMin = vs[0][1] > vs[1][1] ? vs[1][1] : vs[0][1]
    const yMax = vs[0][1] < vs[1][1] ? vs[1][1] : vs[0][1]

    if (x > xMin && x < xMax && y > yMin && y < yMax) {
      inside = true
    }
    // for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    //     var xi = vs[i][0], yi = vs[i][1]
    //     var xj = vs[j][0], yj = vs[j][1]

    //     var intersect = ((yi > y) != (yj > y))
    //         && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    //     if (intersect) inside = !inside
    // }
    return inside
  },

  /**
   * 将图片的某一区域（贴图切片）映射到几何平面上
   * @param {Number} textureWidth 贴图的宽度
   * @param {Number} textureHeight 贴图的高度
   * @param {Object} geometry 映射的目标几何体
   * @param {Number} faceIdx 贴图面的ID
   * @param {Number} x1 贴图切片的左下角x点
   * @param {Number} y1 贴图切片的左下角y点
   * @param {Number} x2 贴图切片的右上角x点
   * @param {Number} y2 贴图切片的右上角y点
   * @param {Boolean} flag 传入flag后取消映射
   */
  mapUv(textureWidth, textureHeight, geometry, faceIdx, x1, y1, x2, y2, flag) {
    var titleUvW = 1 / textureWidth
    var titleUvH = 1 / textureHeight
    if (geometry.faces[faceIdx] instanceof THREE.Face3) {
      var UVs = geometry.faceVertextUvs[0][faceIdx * 2]
      if (faceIdx == 4 && !flag) {
        UVs[0].x = x1 * titleUvW; UVs[0].y = y1 * titleUvH;
        UVs[2].x = x1 * titleUvW; UVs[2].y = y2 * titleUvH;
        UVs[1].x = x2 * titleUvW; UVs[1].y = y1 * titleUvH;
      } else {
        UVs[0].x = x1 * titleUvW; UVs[0].y = y1 * titleUvH;
        UVs[1].x = x1 * titleUvW; UVs[1].y = y2 * titleUvH;
        UVs[2].x = x2 * titleUvW; UVs[2].y = y1 * titleUvH;
      }
      var UVs = geometry.faceVertextUvs[0][faceIdx * 2 + 1];
      if (faceIdx == 4 && !flag) {
        UVs[2].x = x1 * titleUvW; UVs[2].y = y2 * titleUvH;
        UVs[1].x = x2 * titleUvW; UVs[1].y = y2 * titleUvH;
        UVs[0].x = x2 * titleUvW; UVs[0].y = y1 * titleUvH;
      } else {
        UVs[0].x = x1 * titleUvW; UVs[0].y = y2 * titleUvH;
        UVs[1].x = x2 * titleUvW; UVs[1].y = y2 * titleUvH;
        UVs[2].x = x2 * titleUvW; UVs[2].y = y1 * titleUvH;
      }
    }
  }
}