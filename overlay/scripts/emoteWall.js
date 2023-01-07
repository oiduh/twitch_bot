window.onload = function () { return connect_to_server(); };
function connect_to_server() {
    var socket;
    socket = new WebSocket('ws://localhost:3000');
    socket.onmessage = function (event) {
        console.log("received message:");
        console.log(event.data);
        //let img = document.createElement("img");
        //img.src = event.data;
        //document.body.appendChild(img);
        showEmoteCommand(event.data);
    };
    socket.onopen = function (event) { return console.log("connected"); };
    socket.onclose = function (event) { return console.log("closed"); };
    socket.onerror = function (event) { return console.log("error"); };
}
//window.addEventListener("click", showEmoteCommand, false);
function showEmoteCommand(url) {
    var emote = new Emote(url, 128, 128);
    emote.setRandomPosition();
    emote.show();
}
var Emote = /** @class */ (function () {
    function Emote(url, height, width) {
        this.url = url;
        this.height = height;
        this.width = width;
        this.createHTMLImage();
    }
    Emote.prototype.createHTMLImage = function () {
        var img = document.createElement("img");
        // replace this with url to emote
        img.setAttribute("src", this.url);
        // set these dimensions to according values
        img.setAttribute("height", "".concat(this.height, "px"));
        img.setAttribute("width", "".concat(this.width, "px"));
        // apply css style/behavior
        img.setAttribute("id", "emote");
        this.image = img;
    };
    Emote.prototype.setRandomPosition = function () {
        var x = Math.max(Math.floor(Math.random() * window.innerHeight) - this.height, 0), y = Math.max(Math.floor(Math.random() * window.innerWidth) - this.width, 0);
        this.image.style.position = "absolute";
        this.image.style.top = "".concat(x, "px");
        this.image.style.left = "".concat(y, "px");
    };
    Emote.prototype.show = function () {
        var img = this.image;
        document.getElementById("body").appendChild(img);
        setTimeout(function () {
            img.remove();
        }, 8000);
    };
    return Emote;
}());
