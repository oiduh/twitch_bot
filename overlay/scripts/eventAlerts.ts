window.onload = () => connect_to_event_server();

function connect_to_event_server(): void {
    console.log('connected to server!');

    let event_server;
    event_server = new WebSocket('ws://localhost:3001');

    event_server.onmessage = (event) => {
        console.log('received message:')
        console.log(event.data);

        let p = createAlertMessage(JSON.parse(event.data));
        document.body.appendChild(p);
    };

    event_server.onopen = (event) => console.log('connected');
    event_server.onclose = (event) => console.log('closed');
    event_server.onerror = (event) => console.log('error');
}



function createAlertMessage(event: [string, string]): HTMLParagraphElement {
    let paragraph = document.createElement('p');
    let image = document.createElement('img');
    // TODO: pool of random images
    // TODO: add sound effects
    image.src = '../media/images/girls-kiss.gif';
    paragraph.appendChild(image);
    paragraph.appendChild(document.createElement('br'));
    let text_1 = document.createTextNode('Hello ');
    paragraph.appendChild(text_1);
    let user_name_span = document.createElement('span');
    user_name_span.className = 'user_name'
    user_name_span.innerText = event[1];
    paragraph.appendChild(user_name_span);
    let text_2 = document.createTextNode(' !');
    paragraph.appendChild(text_2);
    paragraph.appendChild(document.createElement('br'));
    let text_3 = document.createTextNode('Thank you for following!');
    paragraph.appendChild(text_3);

    setTimeout(function() {
        paragraph.remove();
    }, 8000);

    return paragraph;
}