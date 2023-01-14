window.onload = function () { return connect_to_server(); };
function connect_to_server() {
    var socket;
    socket = new WebSocket('ws://localhost:3000');
    socket.onmessage = function (event) {
        console.log('received message:');
        console.log(event.data);
        showEmoteCommand(event.data);
    };
    socket.onopen = function (event) { return console.log('connected'); };
    socket.onclose = function (event) { return console.log('closed'); };
    socket.onerror = function (event) { return console.log('error'); };
}
function showEmoteCommand(url) {
    // TODO: currently static -> command to change size
    new Emote(url, 128)
        .show();
}
var Emote = /** @class */ (function () {
    function Emote(url, height) {
        this.url = url;
        this.height = height;
        this.createHTMLImage();
        return this;
    }
    Emote.prototype.createHTMLImage = function () {
        var _this = this;
        var img = document.createElement('img');
        // change image size on load -> easier to adjust wide emotes
        img.onload = function () {
            var aspect_ratio = Math.floor(img.width / img.height);
            img.height = _this.height;
            img.width = _this.height * aspect_ratio;
            _this.setRandomPosition();
            img.style.visibility = 'visible';
        };
        img.src = this.url;
        // image hidden until loaded, resized and randomly positioned
        img.style.visibility = 'hidden';
        this.image = img;
    };
    Emote.prototype.setRandomPosition = function () {
        var x = Math.max(Math.floor(Math.random() * window.innerHeight) - this.image.height, 0), y = Math.max(Math.floor(Math.random() * window.innerWidth) - this.image.width, 0);
        this.image.style.position = 'absolute';
        this.image.style.top = "".concat(x, "px");
        this.image.style.left = "".concat(y, "px");
        return this;
    };
    Emote.prototype.show = function () {
        var img = this.image;
        document.getElementById('body').appendChild(img);
        setTimeout(function () {
            img.remove();
        }, 8000);
    };
    return Emote;
}());
