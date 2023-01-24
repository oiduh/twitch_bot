// @ts-ignore
const PORT = 3001;
let BUSY = false;

window.onload = () => {
    connectToEventServer();
}

// TODO: make test server to send a bunch of events!

function connectToEventServer(): void {
    console.log('connected to server!');

    let event_server = new WebSocket(`ws://localhost:${PORT}`);

    event_server.onmessage = (event) => {
        console.log('received message:')
        let event_parsed = JSON.parse(event.data);
        let event_type = event_parsed['type'];
        console.log(event_parsed);

        switch (event_type) {
            case 'GET_STATUS':
                console.log('GET_STATUS RECEIVED');
                event_server.send(JSON.stringify({content: BUSY ? 'BUSY' : 'READY'}));
                break;
            case 'FOLLOWER':
                console.log('FOLLOWER RECEIVED');
                BUSY = !BUSY;
                console.log(event_parsed['image_path']);
                let alert = showMessage(event_parsed['content'], event_parsed['image_path']);
                setTimeout(function() {
                    alert.remove();
                    BUSY = !BUSY;
                    event_server.send(JSON.stringify({content: 'READY'}));
                }, 10000);
                break;
            default:
                console.log(`unknown event: ${event_type}`);
                break;
        }
    };

    event_server.onopen = (event) => console.log('connected');
    event_server.onclose = (event) => console.log('closed');
    event_server.onerror = (event) => console.log('error');
}

function createFollowMessage(user_name: string, image_path: string): HTMLParagraphElement {
    let paragraph = document.createElement('p');
    // TODO: pool of random images
    // TODO: add sound effects
    let image = document.createElement('img');
    image.src = image_path;
    image.height = 500;
    image.width = 500;
    paragraph.appendChild(image);
    paragraph.appendChild(document.createElement('br'));
    paragraph.appendChild(document.createTextNode('Hello '));
    let user_name_span = document.createElement('span', );
    user_name_span.className = 'user_name'
    user_name_span.innerText = user_name;
    paragraph.appendChild(user_name_span);
    paragraph.appendChild(document.createTextNode(' !'));
    paragraph.appendChild(document.createElement('br'));
    paragraph.appendChild(document.createTextNode('Thank you for following!'));
    return paragraph;
}

function showMessage(user_name: string, image_path: string): HTMLParagraphElement {
    let p = createFollowMessage(user_name, image_path);
    document.body.appendChild(p);

    return p;
}