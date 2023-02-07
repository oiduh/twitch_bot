// @ts-ignore
const PORT = 3002;
let player;

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
                player.loadVideoById(data['id'] as string, 0);
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
        videoId: 'fuFbQ-Mewfw',
        playerVars: {
            playsinline: 1,
            autoplay: 0,
            controls: 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onStateChange,
        }
    });

    connectToChatServer();
}

function onPlayerReady() {
    console.log('player ready');
}

let done = false;
function onStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        done = true;
    }
}
