window.onload = () => connect_to_event_server();

// TODO: make test server to send a bunch of events!

let BUSY = false;

function connect_to_event_server(): void {
    console.log('connected to server!');

    let event_server;
    event_server = new WebSocket('ws://localhost:3001');

    event_server.onmessage = (event) => {
        console.log('received message:')
        let received_event = JSON.parse(event.data);
        console.log(received_event);

        switch (received_event['type']) {
            case 'GET_STATUS':
                console.log('GET_STATUS RECEIVED');
                event_server.send(JSON.stringify({content: BUSY ? 'BUSY' : 'READY'}));
                break;
            case 'FOLLOWER':
                console.log('FOLLOWER RECEIVED');

                BUSY = !BUSY;
                let alert = showMessage(received_event['content']);
                setTimeout(function() {
                    alert.remove();
                    BUSY = !BUSY;
                    event_server.send(JSON.stringify({content: 'READY'}));
                }, 10000);
                break;
            default:
                console.log(`unknown event: ${received_event['type']}`);
                break;
        }

    };

    event_server.onopen = (event) => console.log('connected');
    event_server.onclose = (event) => console.log('closed');
    event_server.onerror = (event) => console.log('error');
}



function createFollowMessage(user_name: string): HTMLParagraphElement {
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
    user_name_span.innerText = user_name;
    paragraph.appendChild(user_name_span);
    let text_2 = document.createTextNode(' !');
    paragraph.appendChild(text_2);
    paragraph.appendChild(document.createElement('br'));
    let text_3 = document.createTextNode('Thank you for following!');
    paragraph.appendChild(text_3);
    return paragraph;
}

function showMessage(user_name: string): HTMLParagraphElement {
    let p = createFollowMessage(user_name);
    document.body.appendChild(p);

    return p;
}