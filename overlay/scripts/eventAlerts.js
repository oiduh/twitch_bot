// @ts-ignore
var PORT = 3001;
var BUSY = false;
window.onload = function () {
    connectToEventServer();
};
// TODO: make test server to send a bunch of events!
function connectToEventServer() {
    console.log('connected to server!');
    var event_server = new WebSocket("ws://localhost:".concat(PORT));
    event_server.onmessage = function (event) {
        console.log('received message:');
        var event_parsed = JSON.parse(event.data);
        var event_type = event_parsed['type'];
        console.log(event_parsed);
        switch (event_type) {
            case 'GET_STATUS':
                console.log('GET_STATUS RECEIVED');
                event_server.send(JSON.stringify({ content: BUSY ? 'BUSY' : 'READY' }));
                break;
            case 'FOLLOWER':
                console.log('FOLLOWER RECEIVED');
                BUSY = !BUSY;
                console.log(event_parsed['image_path']);
                var alert_1 = showMessage(event_parsed['content'], event_parsed['image_path']);
                setTimeout(function () {
                    alert_1.remove();
                    BUSY = !BUSY;
                    event_server.send(JSON.stringify({ content: 'READY' }));
                }, 10000);
                break;
            default:
                console.log("unknown event: ".concat(event_type));
                break;
        }
    };
    event_server.onopen = function (event) { return console.log('connected'); };
    event_server.onclose = function (event) { return console.log('closed'); };
    event_server.onerror = function (event) { return console.log('error'); };
}
function createFollowMessage(user_name, image_path) {
    var paragraph = document.createElement('p');
    // TODO: pool of random images
    // TODO: add sound effects
    var image = document.createElement('img');
    image.src = image_path;
    image.height = 500;
    image.width = 500;
    paragraph.appendChild(image);
    paragraph.appendChild(document.createElement('br'));
    paragraph.appendChild(document.createTextNode('Hello '));
    var user_name_span = document.createElement('span');
    user_name_span.className = 'user_name';
    user_name_span.innerText = user_name;
    paragraph.appendChild(user_name_span);
    paragraph.appendChild(document.createTextNode(' !'));
    paragraph.appendChild(document.createElement('br'));
    paragraph.appendChild(document.createTextNode('Thank you for following!'));
    return paragraph;
}
function showMessage(user_name, image_path) {
    var p = createFollowMessage(user_name, image_path);
    document.body.appendChild(p);
    return p;
}
