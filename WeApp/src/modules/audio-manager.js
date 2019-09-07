import audioConf from '../config/audio-conf';
import gameView from '../game/view';

class AudioManager {
  constructor() {
    this.init()
  }

  init() {
    // 实例化每个音频
    for (let key in audioConf.audioSources) {
      this[key] = wx.createInnerAudioContext()
      this[key].src = audioConf.audioSources[key]
    }

    // 小瓶下压时的音频分为两段，当第一段结束后循环播放第二段
    this.shrink_end.loop = true
    this.shrink.onEnded(() => {
      if (gameView.gamePage.bottle.status == 'shrink') {
        this.shrink_end.play()
      }
    })
    
  }
}

export default new AudioManager()