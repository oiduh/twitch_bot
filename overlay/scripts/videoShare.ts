// @ts-ignore
const PORT = 3002;
let player;

// https://developers.google.com/youtube/iframe_api_reference

/*

TODO: potential methods to implement

player.getPlayerState():Number
Returns the state of the player. Possible values are:
-1 – unstarted
0 – ended
1 – playing
2 – paused
3 – buffering
5 – video cued

player.getDuration():Number

player.addEventListener(event:String, listener:String):Void



 */

function connectToChatServer() {
    let chatServer: WebSocket;
    try {
        chatServer = new WebSocket(`ws://localhost:${PORT}`);
    }
    catch (e) {
        console.log(`Error: ${e}`);
        return;
    }


    chatServer.onmessage = (event) => {
        console.log('received message:')
        let data = JSON.parse(event.data);
        let event_type = data['type'];
        console.log(data);

        switch (event_type) {
            case 'video': {
                console.log(`link sent: ${data['id']}`);

                let startSeconds = 5,
                    endSeconds = 15;

                player.loadVideoById({
                        videoId: data['id'],
                        startSeconds: startSeconds,
                        endSeconds: endSeconds
                });
                break;
            }
            default:
                console.log(`unknown event: ${event_type}`);
                break;
        }
    }
}

function onYouTubeIframeAPIReady() {
    console.log('api is ready!');
    player = new YT.Player("video-player", {
        height: 500,
        width: 900,
        videoId: 'D6VT_-mQHqY',
        playerVars: {
            playsinline: 1,
            autoplay: 0,
            controls: 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onStateChange,
            onError: onError,
        }
    });

    connectToChatServer();
}

function onPlayerReady(event) {
    console.log('player ready');
    console.log(event);
    // instead of playing the video it will buffer instead
    // unstarted (-1) -> buffer (3) -> unstarted (-1)
    // without playVideo() -> no state change
    event.target.playVideo();
}

function onStateChange(event) {
    /*
    event.data codes
    -1 -> unstarted
     0 -> ended
     1 -> playing
     2 -> paused
     3 -> buffering
     5 -> video cued
     */


    console.log(event.data);
}

function onError(event) {
    // TODO: deal with errors e.g. inform broadcaster
    switch (event.data) {
        case 2: {
            // can this happen if handled on server
            console.log('Invalid YouTube ID');
            break;
        }
        case 5: {
            console.log('HTML5 error');
            break;
        }
        case 100: {
            console.log('Video might have been removed!');
            break;
        }
        case 101:
        case 150: {
            console.log('The video is not allowed to be embedded!');
            break;
        }
        default: {
            console.log(`unknown error code: ${event.data}`);
            break;
        }
    }
    console.log(event.data);
}
