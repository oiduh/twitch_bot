window.onload = () => connect_to_server();

function connect_to_server() {
    let socket;
    socket = new WebSocket('ws://localhost:3000');

    socket.onmessage = (event) => {
        console.log('received message:')
        console.log(event.data);
        showEmoteCommand(event.data);
    };

    socket.onopen = (event) => console.log('connected');
    socket.onclose = (event) => console.log('closed');
    socket.onerror = (event) => console.log('error');
}

function showEmoteCommand(url): void {
    // TODO: currently static -> command to change size
    new Emote(url, 128)
        .show();
}

class Emote {
    url: string;
    height: number;
    image: HTMLImageElement;

    constructor(url: string, height: number) {
        this.url = url;
        this.height = height;

        this.createHTMLImage();

        return this;
    }

    createHTMLImage(): void {
        let img = document.createElement('img');

        // change image size on load -> easier to adjust wide emotes
        img.onload = () => {
            let aspect_ratio = img.width / img.height;
            img.height = this.height;
            img.width = Math.floor(this.height * aspect_ratio);
            this.setRandomPosition();
            img.id = 'emote';
        }

        img.src = this.url;
        this.image = img;
    }

    setRandomPosition(): this {
        const x = Math.max(Math.floor(Math.random()*window.innerHeight) - this.image.height, 0),
            y = Math.max(Math.floor(Math.random()*window.innerWidth) - this.image.width, 0);
        this.image.style.position = 'absolute';
        this.image.style.top = `${x}px`;
        this.image.style.left = `${y}px`;
        return this;
    }

    show(): void {
        const img = this.image;
        document.getElementById('body').appendChild(img);

        setTimeout(function() {
            img.remove();
        }, 8000);
    }
}

