const fs = require('fs');
const ytdl = require('ytdl-core');

let yt_url = 'https://www.youtube.com/watch?v=oJca6zoI50E';
//let yt_url = 'https://www.youtube.com/watch?v=RXC7U9P0VA1';
let test = async (url) => {
    await ytdl.getBasicInfo(url)
        .then(res => {
                let meta_info = res['videoDetails'];
                //let meta_info = res['player']['videoDetails'];
                //console.log(meta_info);

                let title = meta_info['title'];
                console.log(title);

                let video_length_in_sec = meta_info['lengthSeconds'];

                console.log(`The length of this video is: ${Math.floor(video_length_in_sec/60)}min and ${video_length_in_sec%60}sec`);


                let view_count = meta_info['viewCount'];
                console.log(`The viewcount is: ${view_count}`);

                let age_restricted = meta_info['age_restricted'];
                console.log(`The video is ${age_restricted ? '' : 'NOT'} age restricted`);

                let available_formats = res['formats'];
                //console.log(available_formats);

                let video = available_formats.filter(x => x['mimeType'].includes('video/mp4') && x['mimeType'].includes('mp4a') && x['height'] <= 720);
                //console.log(video);

                console.log('---');

                let best_qual = video.sort((a, b) => (a['height'] > b['height']) ? -1 : (a['height'] < b['height']) ? 1 : 0)[0];
                console.log(best_qual);

                //ytdl(url, { filter: format => format.itag === best_qual['itag'] })
                ytdl(url, { filter: format => format.itag === best_qual['itag'] })
                    .pipe(fs.createWriteStream('video.mp4'));


                // use to merge audio and video
                // https://github.com/fent/node-ytdl-core/blob/HEAD/example/ffmpeg.js
        })
        .catch(e => console.log(e));
}

test(yt_url);