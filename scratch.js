const yt = require('youtube-dl-exec'); yt('https://www.youtube.com/watch?v=D2oZHzC_M28', { dumpJson: true }).then(() => console.log('OK')).catch(e => console.error('ERR:', e.message))
