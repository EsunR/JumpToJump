/**
 * @description 动画库
 * @detail 实现动画的连续播放
 * @param duration 时间间隔
 * @param form
 * @param to
 * @param type
 * @param delay 动画延迟时间
 */

import Tween from './tween';

let animationId = -1
let stoppedAnimationId = animationId - 1

export const customAnimation = {}
customAnimation.to = function (duration, from, to, type, delay = 0) {
  for (let prop in to) {
    if (from[prop] !== undefined) {
      setTimeout(() => {
        TweenAnimation(from[prop], to[prop], duration, type, (value, complete) => {
          // 将新的坐标值应用于对象
          from[prop] = value
        })
      }, delay * 1000)
    }
  }
}

// 计算每个时间点下的动画状态
// duartion 单位为秒
export function TweenAnimation(from, to, duration, type, callback) {
  // 初始化
  const options = {
    callback: function () { },
    type: 'Linear',
    duration: 300
  }
  if (callback) {
    options.callback = callback
  }
  if (type) {
    options.type = type
  }
  if (duration) {
    options.duration = duration
  }

  // 赋予一个动画id
  const selfAnimationId = ++animationId

  // 计算动画时间内产生了多少帧画面
  const frameCount = duration * 1000 / 17
  let start = -1

  const startTime = Date.now()
  let lastTime = Date.now()
  let tweenFn = Tween
  let typeArr = options.type.split(".")
  for (let i in typeArr) {
    tweenFn = tweenFn[typeArr[i]]
    if (tweenFn === undefined) {
      console.error(`调用的动画名 ${typeArr[i]} 不存在`)
    }
  }

  // 绘制
  var step = function () {
    const currentTime = Date.now()
    const interval = currentTime - lastTime
    let fps = 0

    if (interval) {
      fps = Math.ceil(1000 / interval)
    } else {
      requestAnimationFrame(step)
      return
    }

    // 为了防止屏幕 requestAnimationFrame 的不准确，需要计算每帧画面的时间间隔，如果时间间隔过长，则跳过绘制的帧数以同步时间
    if (fps >= 30) {
      start++
    } else {
      const _start = Math.floor((interval / 17))
      start = start + _start
    }

    const value = tweenFn(start, from, to - from, frameCount)

    if (start <= frameCount && selfAnimationId > stoppedAnimationId) {
      options.callback(value)
      requestAnimationFrame(step)
    } else if (start > frameCount && selfAnimationId > stoppedAnimationId) {
      // 参数true用于检测该回调是否是完成时的回调函数
      options.callback(to, true)
    }

    lastTime = Date.now()
  }

  step()
}

export function stopAllAnimation() {
  stoppedAnimationId = animationId
}