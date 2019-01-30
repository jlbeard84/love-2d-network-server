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
        console.log("Peer connected", peer, data);

        peer.on("message", function(packet, channel) {
            console.log("Message Received", packet, channel);

            const bufferText = JSON.stringify(packet.data().toString());

            const messageText = "Got your packet with text: " + bufferText;

            peer.send(0, messageText, function(err) {
                if (err) {
                    console.log("Error sending packet");
                } else {
                    console.log(`Message text: ${messageText} sent successfully`);
                }
            });

            console.log("received packet contents:", bufferText);
        });
    });

    host.start(50);
    console.log("Server ready on %s:%s", host.address().address, host.address().port);
});
