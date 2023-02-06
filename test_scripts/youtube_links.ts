window.onload = () => {

    let player = document.getElementById('youtube-player') as HTMLIFrameElement;
    player.src = 'https://www.youtube.com/embed/tgbNymZ7vqY';

    // simple swap
    // link needs 'embed' and not 'watch'
    setTimeout(() => {
        player.src = 'https://www.youtube.com/embed/DEEJK4zbSS8';
    }, 5000);
}