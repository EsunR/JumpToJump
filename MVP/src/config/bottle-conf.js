import blockConf from './block-conf'
const headRadius = 2.1168

export default {
  // 初始位置
  initPosition: {
    x: -15,
    y: 0,
    z: 0
  },
  // head半径
  headRadius,
  bodyWidth: 3.84,
  horizontalHeight: (1.91423 * headRadius) / 2 + blockConf.height / 2,
  // 弹性系数，弹性系数约大，平面的弹力越强
  elastic: 0.13
}