const enet = require("enet");

const addr = new enet.Address("0.0.0.0", 9521);

enet.createServer({
    address: addr,
    peers: 32,
    channels: 2,
    down: 0,
    up: 0
}, function(err, host) {
    if (err) {
        return;
    }

    host.on("connect", function(peer, data) {
        console.log("Peer connected with ID " + peer._pointer);

        peer.on("message", function(packet, channel) {
            console.log("Message received from " + peer._pointer);

            const now = new Date;

            const utcTimestamp = Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate() , 
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds(), 
                now.getUTCMilliseconds()
            );

            const gameObject = JSON.parse(packet.data().toString());

            const messageText = "Got packet from " + gameObject.client_id + " with message_type of " + gameObject.message_type + " at " + utcTimestamp;

            const responseObject = {
                response_time: utcTimestamp,
                response_text: messageText
            };

            const jsonResponse = JSON.stringify(responseObject);

            peer.send(0, jsonResponse, function(err) {
                if (err) {
                    console.log("Error sending packet");
                } else {
                    console.log(`Message text: ${messageText} sent successfully`);
                }
            });

            console.log("received packet contents:", packet.data().toString());
        });
    });

    host.start(50);
    console.log("Server ready on %s:%s", host.address().address, host.address().port);
});
