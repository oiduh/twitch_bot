window.onclick = () => {
    console.log(window.innerHeight);
    console.log(window.innerWidth);

    let user_name = 'New Friend';

    let body = document.getElementById('body')
    let paragraph = document.createElement('p');
    let image = document.createElement('img');
    image.src = '../media/images/girls-kiss.gif';
    paragraph.appendChild(image);
    paragraph.appendChild(document.createElement('br'));
    let text_1 = document.createTextNode('Hello ');
    paragraph.appendChild(text_1);
    let user_name_span = document.createElement('span');
    user_name_span.className = 'user_name'
    user_name_span.innerText = user_name;
    paragraph.appendChild(user_name_span);
    let text_2 = document.createTextNode(' !');
    paragraph.appendChild(text_2);
    paragraph.appendChild(document.createElement('br'));
    let text_3 = document.createTextNode('Thank you for following!');
    paragraph.appendChild(text_3);

    body.appendChild(paragraph);
}