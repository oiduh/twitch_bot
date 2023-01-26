const ytdl = require('ytdl-core');

let yt_url = 'https://www.youtube.com/watch?v=Rxc7u9p0VAU';
//let yt_url = 'https://www.youtube.com/watch?v=RXC7U9P0VA1';
let test = async (url) => {
    await ytdl.getBasicInfo(url)
        .then(res => {
            let meta_info = res['videoDetails']
            console.log(meta_info);
            //let meta_info = res['player']['videoDetails'];
            //console.log(meta_info);

            let video_length_in_sec = meta_info['lengthSeconds'];
            console.log(`The length of this video is: ${Math.floor(video_length_in_sec/60)}min and ${video_length_in_sec%60}sec`);

            let view_count = meta_info['viewCount'];
            console.log(`The viewcount is: ${view_count}`);

            let age_restricted = meta_info['age_restricted'];
            console.log(`The video is ${age_restricted ? '' : 'NOT'} age restricted`);

            let available_formats = res['formats'];
            let mp4 = available_formats.filter(x => x['mimeType'].includes('video/mp4') && x['height'] <= 720);
            console.log(mp4);

            console.log('---');

            let best_qual = mp4.sort((a, b) => (a['height'] > b['height']) ? -1 : (a['height'] < b['height']) ? 1 : 0)[0];
            console.log(best_qual);
        })
        .catch(e => console.log(e));
}

test(yt_url);