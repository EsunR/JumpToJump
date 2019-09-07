var fs = require('fs')
let root = 'res/audios/'

var fileName = fs.readdirSync('MVP/res/audios/', function (err, files) {
  if (err) {
    console.error(err)
    return;
  } else {
    console.log(files);
  }
})
let audioSources = {}
for (let i in fileName) {
  let name = fileName[i].split('.')[0];
  audioSources[name] = root + fileName[i]
}

console.log(audioSources);