// @ts-ignore
var PORT = 3002;
var player;
function connectToChatServer() {
    var chatServer;
    try {
        chatServer = new WebSocket("ws://localhost:".concat(PORT));
    }
    catch (e) {
        console.log("Error: ".concat(e));
        return;
    }
    chatServer.onmessage = function (event) {
        console.log('received message:');
        var data = JSON.parse(event.data);
        var event_type = data['type'];
        console.log(data);
        switch (event_type) {
            case 'video': {
                console.log("link sent: ".concat(data['id']));
                player.loadVideoById(data['id'], 0);
                break;
            }
            default:
                console.log("unknown event: ".concat(event_type));
                break;
        }
    };
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
            onStateChange: onStateChange
        }
    });
    connectToChatServer();
}
function onPlayerReady() {
    console.log('player ready');
}
var done = false;
function onStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done) {
        done = true;
    }
}
