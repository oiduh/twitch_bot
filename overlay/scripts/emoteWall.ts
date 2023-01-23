// @ts-ignore
const PORT = 3000;
const DEFAULT_EMOTE_HEIGHT = 128;


window.onload = () => connect_to_server();

function connect_to_server() {
    let socket;
    socket = new WebSocket(`ws://localhost:${PORT}`);

    socket.onmessage = (image_source) => {
        console.log('received message:')
        console.log(image_source.data);
        new Emote(image_source.data, DEFAULT_EMOTE_HEIGHT).show();
    };

    socket.onopen = (event) => console.log('connected');
    socket.onclose = (event) => console.log('closed');
    socket.onerror = (event) => console.log('error');
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
        img.style.visibility = 'hidden';
        img.src = this.url;
        this.image = img;

        // change image size on load -> otherwise size and proportion unknown
        img.onload = () => {
            let aspect_ratio = img.width / img.height;
            img.height = this.height;
            img.width = Math.floor(this.height * aspect_ratio);
            this.setRandomPosition();
            img.style.visibility = 'visible';
            img.id = 'emote';
        }
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

