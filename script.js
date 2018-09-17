var scrollDistancePerSecond = 100; // Scroll 50px every second.
var scrollDistancePerAnimationFrame = Math.ceil(scrollDistancePerSecond / 60); // Animate at 60 fps.
var wrapper = document.getElementById('wrapper');
var startButton = document.querySelector('button');
var last = document.getElementById('last');
var playerArea = document.getElementById('playerArea');
var wordholder = document.getElementById('wordholder');
var newWord = []
var wordToCheck
var request = new XMLHttpRequest();
var response
var count = 0;
var idCount = 0;
var landscape = document.querySelectorAll('.landscape');


// initialize game
var gameStart = function() {
    startButton.style.display = "none"; //hide start button
    document.querySelector('.intro').style.display="none";
    autoScroll(wrapper); //begin character fall
}

// game graphics
var createGraphic = function() {
    var left = document.createElement('div');
    left.classList.add('left');
    var right = document.createElement('div');
    right.classList.add('right');

    var continuous = document.createElement('div');
    continuous.classList.add("landscape");

    var all = document.createElement('div');
    all.classList.add('all');

    for (var i = 0; i < 30; i++) {
        var leftWall = document.createElement('div');
        leftWall.classList.add('leftRandom');
        leftWall.style.left = Math.random() * 10 + 'px';
        leftWall.style.top = Math.random() * window.innerHeight + 'px';
        left.appendChild(leftWall);
    }

    for (var i = 0; i < 10; i++) {
        var rightWall = document.createElement('div');
        rightWall.classList.add('rightRandom');
        rightWall.style.left = Math.random() * 10 + 'px';
        rightWall.style.top = Math.random() * window.innerHeight + 'px';
        right.appendChild(rightWall);
    }

    all.appendChild(left);
    all.appendChild(right);
    all.appendChild(continuous);
    wrapper.appendChild(all);
    document.getElementById('player').style.display="block";



    //         while (landscape[1].previousSibling !== null) {
    //             wrapper.removeChild(landscape[1].previousSibling)
    // }

    // random letters
    var randomNum = Math.ceil(Math.random() * 8);
    for (var i = 0; i < randomNum; i++) {
        var alphabet = ["a", "a", "a", "a", "a", "a", "a", "a", "a", "b", "b", "c", "c", "d", "d", "d", "d", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "e", "f", "f", "g", "g", "g", "h", "h", "i", "i", "i", "i", "i", "i", "i", "i", "i", "j", "k", "l", "l", "l", "l", "m", "m", "n", "n", "n", "n", "n", "n", "o", "o", "o", "o", "o", "o", "o", "o", "p", "p", "q", "r", "r", "r", "r", "r", "r", "s", "s", "s", "s", "t", "t", "t", "t", "t", "t", "u", "u", "u", "u", "v", "v", "w", "w", "x", "y", "y", "z"];
        var randomNumber = Math.ceil(Math.random() * 26);
        var letterBlocks = document.createElement('p');
        letterBlocks.classList.add('letterBlock');
        letterBlocks.textContent = alphabet[randomNumber];
        letterBlocks.style.top = (100 * Math.random()) + "%";
        letterBlocks.style.left = (100 * Math.random()) + "%";
        continuous.appendChild(letterBlocks);

        //give each letter div an id
        letterBlocks.setAttribute('id', idCount++);
    }


}

// simulate free falling
var autoScroll = function(element) {

    // add points counter
    var scoreboard = document.querySelector('.scoreboard');
    scoreboard.textContent = "SCORE: " + count;

    // if scroll is less than body height, continue to scroll
    if (element.scrollTop < element.scrollHeight) {
        window.requestAnimationFrame(autoScroll.bind(null, element));
        element.scrollTop += scrollDistancePerAnimationFrame;
    }

    // at the end of prepared body, continuously create gameboard graphic
    if (element.scrollTop === element.scrollHeight - last.offsetHeight) {
        console.log(last.offsetHeight)
        console.log(window.innerHeight)
        createGraphic();
    }
}

// allow player to move avatar
var playerMove = function(event) {
    var playerCurrentLeft = parseInt(document.getElementById('player').offsetLeft);
    var player = document.getElementById('player')
    var indLetter = document.querySelectorAll('p');

    // check for div overlap
    var rect = player.getBoundingClientRect();

    for (var i = 0; i < idCount; i++) {
        var letterRect = indLetter[i].getBoundingClientRect();
        var playerTop = rect.top;
        var playerBottom = playerTop + 100;
        var playerLeft = rect.left;
        var playerRight = rect.right;

        var letterTop = letterRect.top;
        var letterBottom = letterTop + 50;
        var letterLeft = letterRect.left;
        var letterRight = letterRect.right;

        // when divs collide, run storeLetter
        if (playerBottom >= letterTop && playerTop < letterBottom && playerLeft < letterLeft && playerRight > letterRight) {
            indLetter[i].style.display = "none"
            var storedLetter = indLetter[i].innerHTML
            newWord.push(storedLetter); // create array with collected letters
            storeLetter();
        }

    }

    if (event.keyCode === 37) { // if left arrow is pressed, move left
        player.style.left = playerCurrentLeft - 10 + 'px';
        document.getElementById('wordholder').style.display="block";

    } else if (event.keyCode === 39) { // if right arrow is pressed, move right
        player.style.left = playerCurrentLeft + 10 + 'px';
        document.getElementById('wordholder').style.display="block";

    } else if (event.keyCode === 32) { // if spacebar, store alphabets
        requestAPI();

    } else if (event.keyCode === 88) { // if x, clear stored alphabets
        clearBox();
    }
}

// store letter in word holder before checking
var storeLetter = function() {
    wordToCheck = newWord.join(''); // string array
    wordholder.textContent = wordToCheck; // append letters into wordholder box
}

// remove all stored letters
var clearBox = function() {
    wordholder.textContent = ""; // reset parameters
    newWord = [];
    wordToCheck = "";
}

// var collectLetters = function(){
//     // check which letter is selected and push into newWord Array
//         var letters = document.querySelectorAll('.letterBlock')
//         for (var i = 0; i < letters.length; i++) {
//             letters[i].addEventListener('click', function() {
//                 this.style.display = "none"
//                 var storedLetter = this.innerHTML
//                 newWord.push(storedLetter); // create array with collected letters
//                 storeLetter();
//             });
//         }

// }

// on spacebar key press, check word with API
var requestAPI = function(event) {
    var getURL = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20180916T145957Z.606725e143dce44d.75dbf2de27c080d0b63c1a2e7f2f61c66fc7db27&lang=en-ru&text=" + wordToCheck;

    // listen for the request response
    request.addEventListener("load", responseHandler);

    // ready the system by calling open, and specifying the url
    request.open("GET", getURL);

    // send the request
    request.send();
}


var responseHandler = function() {
    response = JSON.parse(this.responseText);
    checkWord(response);
};


var requestFailed = function() {
    console.log("response text", this.responseText);
    console.log("status text", this.statusText);
    console.log("status code", this.status);
};

var checkWord = function(event) {
    // clear word holder box regardless of points
    if (response.def[0] !== undefined) { // if word doesnt exist, just clear holder, no points
        if (response.def[0].text === wordToCheck) { // if word exists in dictionary,
            if (wordToCheck.length > 4) { // if word is longer than 4 letters long, give more points
                count += 10;
                clearBox();

            } else {
                count += 5;
                clearBox();

            }
        }
    } else {
        clearBox();
    }

}

// listen for the request response
request.addEventListener("load", responseHandler);
request.addEventListener("error", requestFailed);


startButton.addEventListener('click', gameStart);
window.addEventListener('keydown', playerMove);