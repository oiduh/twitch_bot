window.onclick = function () {
    console.log(window.innerHeight);
    console.log(window.innerWidth);
    var user_name = 'New Friend';
    var body = document.getElementById('body');
    var paragraph = document.createElement('p');
    var image = document.createElement('img');
    image.src = '../media/images/girls-kiss.gif';
    paragraph.appendChild(image);
    paragraph.appendChild(document.createElement('br'));
    var text_1 = document.createTextNode('Hello ');
    paragraph.appendChild(text_1);
    var user_name_span = document.createElement('span');
    user_name_span.className = 'user_name';
    user_name_span.innerText = user_name;
    paragraph.appendChild(user_name_span);
    var text_2 = document.createTextNode(' !');
    paragraph.appendChild(text_2);
    paragraph.appendChild(document.createElement('br'));
    var text_3 = document.createTextNode('Thank you for following!');
    paragraph.appendChild(text_3);
    body.appendChild(paragraph);
};