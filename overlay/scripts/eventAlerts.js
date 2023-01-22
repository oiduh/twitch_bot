window.onload = function () { return connect_to_event_server(); };
// TODO: make test server to send a bunch of events!
var BUSY = false;
function connect_to_event_server() {
    console.log('connected to server!');
    var event_server;
    event_server = new WebSocket('ws://localhost:3001');
    event_server.onmessage = function (event) {
        console.log('received message:');
        var received_event = JSON.parse(event.data);
        console.log(received_event);
        switch (received_event['type']) {
            case 'GET_STATUS':
                console.log('GET_STATUS RECEIVED');
                event_server.send(JSON.stringify({ content: BUSY ? 'BUSY' : 'READY' }));
                break;
            case 'FOLLOWER':
                console.log('FOLLOWER RECEIVED');
                BUSY = !BUSY;
                var alert_1 = showMessage(received_event['content']);
                setTimeout(function () {
                    alert_1.remove();
                    BUSY = !BUSY;
                    event_server.send(JSON.stringify({ content: 'READY' }));
                }, 10000);
                break;
            default:
                console.log("unknown event: ".concat(received_event['type']));
                break;
        }
    };
    event_server.onopen = function (event) { return console.log('connected'); };
    event_server.onclose = function (event) { return console.log('closed'); };
    event_server.onerror = function (event) { return console.log('error'); };
}
function createFollowMessage(user_name) {
    var paragraph = document.createElement('p');
    var image = document.createElement('img');
    // TODO: pool of random images
    // TODO: add sound effects
    image.src = '../media/images/girls-kiss.gif';
    paragraph.appendChild(image);
    paragraph.appendChild(document.createElement('br'));
    var text_1 = document.createTextNode('Hello ');
    paragraph.appendChild(text_1);
    var user_name_span = document.createElement('span');
    user_name_span.className = 'user_name';
    user_name_span.innerText = user_name;
    paragraph.appendChild(user_name_span);
    var text_2 = document.createTextNode(' !');
    paragraph.appendChild(text_2);
    paragraph.appendChild(document.createElement('br'));
    var text_3 = document.createTextNode('Thank you for following!');
    paragraph.appendChild(text_3);
    return paragraph;
}
function showMessage(user_name) {
    var p = createFollowMessage(user_name);
    document.body.appendChild(p);
    return p;
}
