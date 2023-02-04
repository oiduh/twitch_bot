var ytdl = require('ytdl-core');
var videojs = require('video.js');
var videojs_playlist = require('videojs-playlist');
var player = videojs();
player.playlist([{
        sources: [{
                type: 'video/youtube',
                src: 'https://www.youtube.com/watch?v=qGyPuey-1Jw'
            }]
    }, {
        sources: [{
                type: 'video/youtube',
                src: 'https://www.youtube.com/watch?v=DEEJK4zbSS8'
            }]
    },
]);
console.log(player.playlist.currentItem());
