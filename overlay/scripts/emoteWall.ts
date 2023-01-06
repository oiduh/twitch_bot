window.addEventListener("click", showEmoteCommand, false);
function showEmoteCommand() {
    let emote = new Emote("../media/images/KEKW.png", 128, 128);
    emote.setRandomPosition();
    emote.show();
}

class Emote {
    url: string;
    height: number;
    width: number;
    image: HTMLImageElement;

    constructor(url: string, height: number, width: number) {
        this.url = url;
        this.height = height;
        this.width = width;

        this.createHTMLImage();
    }

    createHTMLImage(): void {
        let img = document.createElement("img");
        // replace this with url to emote
        img.setAttribute("src", this.url);
        // set these dimensions to according values
        img.setAttribute("height", `${this.height}px`);
        img.setAttribute("width", `${this.width}px`);
        // apply css style/behavior
        img.setAttribute("id", "emote");

        this.image = img;
    }

    setRandomPosition(): void {
        const x = Math.max(Math.floor(Math.random()*window.innerHeight) - this.height, 0),
            y = Math.max(Math.floor(Math.random()*window.innerWidth) - this.width, 0);
        this.image.style.position = "absolute";
        this.image.style.top = `${x}px`;
        this.image.style.left = `${y}px`;
    }

    show(): void {
        const img = this.image;
        document.getElementById("body").appendChild(img);

        setTimeout(function() {
            img.remove();
        }, 8000);
    }
}

