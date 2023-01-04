const ws = require("ws");
require("dotenv").config();

const BROADCASTER_USER_ID = "112465769";

let events: Record<string, any>[] = [];

function addEvents(data: Record<string, any>): void {
    events.push(data);
}


const event_handler = new ws.WebSocket("wss://eventsub-beta.wss.twitch.tv/ws");

event_handler.on('open', function open() {
    console.log("connection established");
});

event_handler.on('message', async function message(data) {
    let parsed_data = JSON.parse(data);
    console.log("---------START------------");
    console.log(parsed_data);
    console.log("----------END-------------");
    if(messageVerrifed(parsed_data)) {
        let metadata = parsed_data["metadata"];
        let message_type = metadata["message_type"];
        console.log(`A message with type "${message_type}" was received!`);

        if(message_type === "session_welcome") {
            // TODO: function that subscribes to all predefined events
            // https://dev.twitch.tv/docs/eventsub/eventsub-subscription-types#subscription-types

            let session_id = parsed_data["payload"]["session"]["id"];

            let channel_follows = {
                "type": "channel.follow",
                "version": "1",
                "condition": {
                    "broadcaster_user_id": BROADCASTER_USER_ID
                },
                "transport": {
                    "method": "websocket",
                    "session_id": `${session_id}`
                }
            };

            addEvents(channel_follows);


            /*let res = */await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(events[0]),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))

            // CHECK ALL EVENTS THE BOT IS SUBSCRIBED TO

            await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                method: "GET",
                headers: getAuthHeaders(false)
            })
                .then((response) => response.json())
                .then((data) => console.log(data))

        }
        else if(parsed_data["metadata"]["message_type"] === "notification"){

            let subscription_type = metadata["subscription_type"];

            console.log(`The notification type is ${subscription_type}`);

            if(subscription_type === "channel.follow") {
                let new_follower_name = parsed_data["payload"]["event"]["user_name"];
                console.log(`${new_follower_name} just subscribed -> do something silly!`)
            }

            // TODO: handle other notifications

        }
    }
});

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



