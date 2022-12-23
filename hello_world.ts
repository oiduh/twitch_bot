let message: string = 'Hello, World!';

let heading = document.createElement('h1');
heading.textContent = message;

document.body.appendChild(heading);

// compile the script with the command "tsc.cmd hello_world.ts"
// this creates the corresponding javascript file
// run the js file with the command "node hello_world.js"
