const ws = require("ws");
require("dotenv").config();
import {Queue} from "../utility/queue";


// EVENT TYPE
//
type Event = {
    type: string,
    content: string,
}

// EVENT QUEUE
//
let event_queue = new Queue<Event>();


// SERVER COMMUNICATING WITH OVERLAY
//
let event_server = new ws.Server({port: 3001});
let event_client;
event_server.on("connection", async (ws) => {
    console.log("new connection");
    event_client = await ws;
    event_client.on("message", (response) => {
        let message = JSON.parse(response)['content'];
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
});

// LIST OF EVENTS TO SUBSCRIBE TO
//
let events: Array<string> = [
    'channel.follow', 'channel.update'
];

// CLIENT LISTENING TO EVENTS
//
const event_handler = new ws.WebSocket("wss://eventsub-beta.wss.twitch.tv/ws");

event_handler.on('message', async function message(data) {
    let parsed_data = JSON.parse(data);
    console.log("---------START------------");
    console.log(parsed_data);
    console.log("----------END-------------");
    if(messageVerrifed(parsed_data)) {
        let metadata = parsed_data["metadata"];
        let message_type = metadata["message_type"];
        console.log(`A message with type "${message_type}" was received!`);

        // HANDLE DIFFERENT TYPE OF MESSAGES
        //
        // TODO: change to switch statement
        switch (message_type) {
            case 'session_welcome': {
                let session_id = parsed_data["payload"]["session"]["id"];

                for (const event_type of events) {
                    let event_sub_message = createEventSubscription(event_type, session_id);
                    await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                        method: "POST",
                        headers: getAuthHeaders(),
                        body: JSON.stringify(event_sub_message),
                    })
                        .then((response) => response.json())
                        .then((data) => console.log(data))
                }

                // CHECK ALL EVENTS THE BOT IS SUBSCRIBED TO

                await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                    method: "GET",
                    headers: getAuthHeaders(false)
                })
                    .then((response) => response.json())
                    .then((data) => console.log(data))
                break;
            }
            case 'notification': {
                let subscription_type = metadata["subscription_type"];

                console.log(`The notification type is ${subscription_type}`);

                if(subscription_type === "channel.follow") {
                    let new_follower_name = parsed_data["payload"]["event"]["user_name"];
                    console.log(`${new_follower_name} just followed -> do something silly!`);
                    try {
                        //event_client.send(JSON.stringify(['Follow', new_follower_name]));
                        let new_event: Event = {
                            type: 'FOLLOWER',
                            content: new_follower_name
                        }
                        event_queue.enqueue(new_event);
                        let status_request: Event = {
                            type: 'GET_STATUS',
                            content: ''
                        }
                        event_client.send(JSON.stringify(status_request));
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                break;
            }
            default: {
                console.log(`unknown message type: ${message_type}`);
                break;
            }
        }
    }
});

function createEventSubscription(subscription_type: string, session_id: string): Record<string, any> {
    return {
        "type": `${subscription_type}`,
        "version": "1",
        "condition": {
            "broadcaster_user_id": process.env.TWITCH_BROADCASTER_ID,
        },
        "transport": {
            "method": "websocket",
            "session_id": `${session_id}`
        }
    }
}

function messageVerrifed(data: Record<any, any>): boolean {
    return "metadata" in data && "message_type" in data["metadata"];
}

function getAuthHeaders(content_type: boolean = true): Record<string, string> {
    let headers = {
        "Authorization": `Bearer ${process.env.TWITCH_OAUTH_TOKEN_CHANNEL}`,
        "Client-Id": `${process.env.TWITCH_CLIENT_ID_CHANNEL}`
    };
    if(content_type)
        headers["Content-Type"] = "application/json";

    return headers;
}



