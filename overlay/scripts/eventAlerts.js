window.onload = function () { return connect_to_event_server(); };
function connect_to_event_server() {
    console.log('connected to server!');
    var event_server;
    event_server = new WebSocket('ws://localhost:3001');
    event_server.onmessage = function (event) {
        console.log('received message:');
        console.log(event.data);
        var p = createAlertMessage(JSON.parse(event.data));
        document.body.appendChild(p);
    };
    event_server.onopen = function (event) { return console.log('connected'); };
    event_server.onclose = function (event) { return console.log('closed'); };
    event_server.onerror = function (event) { return console.log('error'); };
}
function createAlertMessage(event) {
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
    user_name_span.innerText = event[1];
    paragraph.appendChild(user_name_span);
    var text_2 = document.createTextNode(' !');
    paragraph.appendChild(text_2);
    paragraph.appendChild(document.createElement('br'));
    var text_3 = document.createTextNode('Thank you for following!');
    paragraph.appendChild(text_3);
    return paragraph;
}
