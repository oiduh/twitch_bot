window.onload = function () {
    var player = document.getElementById('youtube-player');
    player.src = 'https://www.youtube.com/embed/tgbNymZ7vqY';
    // simple swap
    // link needs 'embed' and not 'watch'
    setTimeout(function () {
        player.src = 'https://www.youtube.com/embed/DEEJK4zbSS8';
    }, 5000);
};
