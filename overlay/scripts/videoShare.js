// @ts-ignore
var PORT = 3002;
var player;
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
                var startSeconds = 5, endSeconds = 15;
                player.loadVideoById({
                    videoId: data['id'],
                    startSeconds: startSeconds,
                    endSeconds: endSeconds
                });
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
        videoId: 'D6VT_-mQHqY',
        playerVars: {
            playsinline: 1,
            autoplay: 0,
            controls: 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onStateChange,
            onError: onError
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
    console.log(event.data);
}
function onError(event) {
    console.log(event.data);
}
