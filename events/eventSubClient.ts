const ws = require("ws");
require("dotenv").config();

const cli = new ws.WebSocket("wss://eventsub-beta.wss.twitch.tv/ws");

cli.on('open', function open() {
    console.log("connection established");
});

cli.on('message', async function message(data) {
    let parsed_data = JSON.parse(data);
    if("metadata" in parsed_data && "message_type" in parsed_data["metadata"]) {
        console.log(`A message with type "${parsed_data["metadata"]["message_type"]}" was received!`);

        if(parsed_data["metadata"]["message_type"] === "session_welcome") {
            let res = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.TWITCH_OAUTH_TOKEN_CHANNEL}`,
                    "Client-Id": `${process.env.TWITCH_CLIENT_ID_CHANNEL}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "type": "channel.follow",
                    "version": "1",
                    "condition": {
                        "broadcaster_user_id": "112465769"
                    },
                    "transport": {
                        "method": "websocket",
                        "session_id": `${parsed_data["payload"]["session"]["id"]}`
                    }
                }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
        }
        else if(parsed_data["metadata"]["message_type"] === "notification"){
            console.log("notification received!");
        }
    }
});





