let root = 'res/audios/'
let audioSources = {}
let fileName = [
  'combo1.mp3',
  'combo2.mp3',
  'combo3.mp3',
  'combo4.mp3',
  'combo5.mp3',
  'combo6.mp3',
  'combo7.mp3',
  'combo8.mp3',
  'fall.mp3',
  'fall_2.mp3',
  'icon.mp3',
  'perfect.mp3',
  'pop.mp3',
  'readFile.js',
  'shrink.mp3',
  'shrink_end.mp3',
  'sing.mp3',
  'start.mp3',
  'store.mp3',
  'success.mp3',
  'water.mp3'
]

for (let i in fileName) {
  let name = fileName[i].split('.')[0];
  audioSources[name] = root + fileName[i]
}

export default {
  audioSources
}