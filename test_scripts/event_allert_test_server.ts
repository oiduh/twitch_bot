const ws = require("ws");
require("dotenv").config();
import {Queue} from "../utility/queue";

type Event = {
    type: string,
    content: string,
}

// EVENT QUEUE
//
let event_queue = new Queue<Event>();
event_queue.enqueue({type: 'FOLLOWER', content: 'first'} as Event);
for (const user_name of ['user1', 'user2', 'weeb1', 'weeb2', 'gachi1']) {
    setTimeout( function() {
        event_queue.enqueue({type: 'FOLLOWER', content: user_name} as Event);
        event_client.send(JSON.stringify({type: 'GET_STATUS', content: ''} as Event));
    }, Math.floor(Math.random() * 30000));
}
event_queue.show();


// SERVER COMMUNICATING WITH OVERLAY
//
let event_server = new ws.Server({port: 3001});
let event_client;
event_server.on("connection", async (ws) => {
    console.log("new connection");
    event_client = await ws;
    event_client.on("message", (response) => {
        let message = JSON.parse(response)['content'];
        console.log(`received message: ${message} of type: ${typeof message}`);
        switch (message) {
            case 'BUSY':
                console.log('client is busy, wait for READY message');
                break;
            case 'READY':
                console.log('client is ready, processing next event, if available');
                if (event_queue.size() > 0) {
                    let next_event = event_queue.dequeue();
                    event_client.send(JSON.stringify(next_event));
                }
                break;
            default:
                console.log(`unknown message: ${message}`);
                break;
        }
    });

    event_client.send(JSON.stringify({type: 'GET_STATUS', content: ''} as Event));
});