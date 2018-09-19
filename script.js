window.onload = function() {
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
    var response;
    var count;
    var idCount;
    var leftWallId;
    var rightWallId;
    var randomBlockId;
    var all = document.querySelector('.all');
    var scrollcount;
    var leftWallCurr;
    var rightWallCurr;
    // basline time for the map to shift
    var baseline = 5;
    var left;
    var right;

    // var landscape = document.querySelectorAll('.landscape');


    // initialize game
    var gameStart = function() {
        count = 0;
        idCount = 0;
        leftWallId = 0;
        rightWallId = 0;
        randomBlockId = 0;
        scrollcount = 0;

        startButton.style.display = "none"; //hide start button
        document.querySelector('.intro').style.display = "none";
        autoScroll(wrapper); //begin character fall

        startButton.removeEventListener('click', gameStart, false);

    }

    // game graphics
    var createGraphic = function() {

        // variables for the amount of surface blocks to be created depending on left/right space
        var blockNumLeft = 35;
        var blockNumRight = 35;

        left = document.createElement('div');
        left.classList.add('left');
        right = document.createElement('div');
        right.classList.add('right');

        var continuous = document.createElement('div');
        continuous.classList.add("landscape");

        for (var i = 0; i < blockNumLeft; i++) {
            var leftWall = document.createElement('div');
            leftWall.classList.add('leftRandom');
            leftWall.style.left = Math.random() * 10 + 'px';
            leftWall.style.top = Math.random() * window.innerHeight + 'px';
            left.appendChild(leftWall);

            leftWall.setAttribute('id', leftWallId++);

        }

        for (var i = 0; i < blockNumRight; i++) {
            var rightWall = document.createElement('div');
            rightWall.classList.add('rightRandom');
            rightWall.style.left = Math.random() * 10 + 'px';
            rightWall.style.top = Math.random() * window.innerHeight + 'px';
            right.appendChild(rightWall);

            rightWall.setAttribute('id', rightWallId++);
        }

        all.appendChild(left);
        all.appendChild(right);
        all.appendChild(continuous);

        wrapper.appendChild(all);
        document.getElementById('player').style.display = "block";

        // random letters
        var randomNum = Math.ceil(Math.random() * 12);
        for (var i = 0; i < randomNum; i++) {
            var alphabet = ["a", "a", "b", "b", "c", "c", "d", "d", "e", "e", "e", "f", "f", "g", "g", "h", "i", "i", "j", "k", "l", "l", "m", "n", "n", "o", "o", "p", "p", "q", "r", "r", "s", "s", "t", "t", "u", "u", "v", "w", "x", "y", "y", "z"];
            var randomNumber = Math.ceil(Math.random() * 26);
            var letterBlocks = document.createElement('div');
            letterBlocks.classList.add('letterBlock');
            letterBlocks.textContent = alphabet[randomNumber];
            letterBlocks.style.top = (100 * Math.random()) + "%";
            letterBlocks.style.left = (100 * Math.random()) + "%";
            continuous.appendChild(letterBlocks);

            //give each letter div an id
            letterBlocks.setAttribute('id', idCount++);
        }

        // every 5 seconds, determine if a random blocker should appear
        setInterval(function() {
            var trueFalse = Math.ceil(Math.random() * 2);
            if (trueFalse === 1) {
                randomBlock.style.display = "block";
            }
        }, 5000);

        for (var i = 0; i < 2; i++) {
            var randomBlock = document.createElement('div');
            randomBlock.classList.add('randomBlock');
            randomBlock.style.top = (100 * Math.random()) + "%";
            randomBlock.style.left = (100 * Math.random()) + "%";
            randomBlock.style.display = "none";
            continuous.appendChild(randomBlock);

            randomBlock.setAttribute('id', randomBlockId++);
        }
        // choose to move map left or right
        if (scrollcount === baseline) {
        moveMap();
        }

        // }}, 5000);
    }

    var moveMap = function(){

            var moveDirection = Math.ceil(Math.random() * 2);
            if (moveDirection === 1) {                                              // if moveDirection === 1, move right

                // get wall's current position
                console.log('moving');
                leftWallCurr = parseInt(left.offsetWidth);
                rightWallCurr = parseInt(right.offsetWidth);

                // if scrolled to the baseline amount, shift the map * amount
                left.style.width = leftWallCurr + 200 +'px';
                right.style.width = leftWallCurr - 200 + 'px';
                baseline +=7;
            }

            else {                                                                  // if moveDirection === 2, move left
                // get wall's current position
                leftWallCurr = parseInt(left.offsetWidth);
                rightWallCurr = parseInt(right.offsetWidth);

                // if scrolled to the baseline amount, shift the map * amount
                left.style.width = leftWallCurr - 200 + 'vw';
                right.style.width = rightWallCurr + 200 + 'vw';
                baseline += 5;
            }
    }

    // simulate free falling
    var autoScroll = function(element) {

        // add points counter
        var scoreboard = document.querySelector('.scoreboard');
        scoreboard.textContent = "SCORE: " + count;

        if (document.querySelector('.gameover').style.display !== "block") {

            // if scroll is less than body height, continue to scroll
            if (element.scrollTop < element.scrollHeight) {
                window.requestAnimationFrame(autoScroll.bind(null, element));
                element.scrollTop += scrollDistancePerAnimationFrame;
            }

            // at the end of prepared body, continuously create gameboard graphic
            if (element.scrollTop === element.scrollHeight - last.offsetHeight) {
                scrollcount++;
                console.log(scrollcount);
                createGraphic();
                var multiplefive = scrollcount % 5
                if(multiplefive === 0){
                scrollDistancePerSecond = scrollDistancePerSecond + 100;
                }

            }
        }
    }

    // allow player to move avatar
    var playerMove = function(event) {
        var playerCurrentLeft = parseInt(document.getElementById('player').offsetLeft);
        var player = document.getElementById('player')
        var indLetter = document.querySelectorAll('.letterBlock');
        var leftBlocks = document.querySelectorAll('.leftRandom');
        var rightBlocks = document.querySelectorAll('.rightRandom');
        var randomBlocks = document.querySelectorAll('.randomBlock');

        // check for div overlap
        // get player position
        var rect = player.getBoundingClientRect();
        var playerTop = rect.top;
        var playerBottom = playerTop + 100;
        var playerLeft = rect.left;
        var playerRight = rect.right;


        // get leter positions
        for (var i = 0; i < idCount; i++) {
            var letterRect = indLetter[i].getBoundingClientRect();

            var letterTop = letterRect.top;
            var letterBottom = letterTop + 50;
            var letterLeft = letterRect.left;
            var letterRight = letterRect.right;

            // when divs collide, run storeLetter
            if (playerBottom >= letterTop && playerTop < letterBottom && playerLeft < letterLeft && playerRight > letterRight) {
                document.getElementById("boop").play();
                indLetter[i].style.display = "none";
                var storedLetter = indLetter[i].innerHTML
                newWord.push(storedLetter); // create array with collected letters
                storeLetter();
            }
        }

        // check for left wall collide
        for (var i = 0; i < leftWallId; i++) {
            var leftBlockRect = leftBlocks[i].getBoundingClientRect();
            var leftBlockTop = leftBlockRect.top;
            var leftBlockBottom = leftBlockTop + 50;
            var leftBlockLeft = leftBlockRect.left;
            var leftBlockRight = leftBlockRect.right;

            // when divs collide, run storeLetter
            if (playerBottom >= leftBlockTop && playerTop < leftBlockBottom && playerLeft < leftBlockLeft && playerRight > leftBlockRight) {
                document.getElementById('player').style.backgroundImage = 'url("images/explode_gif.gif")';
                document.getElementById("die").play();

                document.querySelector('.gameover').style.display = "block";
                startButton.style.display = "block";
                startButton.textContent = "Replay Game"
                document.getElementById('wordholder').style.display = "none";
                window.removeEventListener('keydown', playerMove, false);
                startButton.addEventListener('click', gameReset);
            }

        }

        // check for right wall collide
        for (var i = 0; i < rightWallId; i++) {

            var rightBlockRect = rightBlocks[i].getBoundingClientRect();
            var rightBlockTop = rightBlockRect.top;
            var rightBlockBottom = rightBlockTop + 50;
            var rightBlockLeft = rightBlockRect.left;
            var rightBlockRight = rightBlockRect.right;

            // when divs collide, run storeLetter
            if (playerBottom >= rightBlockTop && playerTop < rightBlockBottom && playerLeft < rightBlockLeft && playerRight > rightBlockRight) {
                document.getElementById('player').style.backgroundImage = 'url("images/explode.png")';
                document.getElementById("die").play();

                document.querySelector('.gameover').style.display = "block";
                startButton.style.display = "block";
                startButton.textContent = "Replay Game"
                document.getElementById('wordholder').style.display = "none";
                window.removeEventListener('keydown', playerMove, false);
                startButton.addEventListener('click', gameReset);
            }

        }

        //check for random block collide
        for (var j = 0; j < randomBlockId; j++) {

            var randomBlockRect = randomBlocks[j].getBoundingClientRect();
            var randomBlockTop = randomBlockRect.top;
            var randomBlockBottom = randomBlockTop + 50;
            var randomBlockLeft = randomBlockRect.left;
            var randomBlockRight = randomBlockRect.right;

            if (playerBottom >= randomBlockTop && playerTop < randomBlockBottom && playerLeft < randomBlockLeft && playerRight > randomBlockRight) {
                document.getElementById('player').style.backgroundImage = 'url("images/explode_gif.gif")';
                document.getElementById("die").play();

                document.querySelector('.gameover').style.display = "block";
                startButton.style.display = "block";
                startButton.textContent = "Replay Game";
                document.getElementById('wordholder').style.display = "none";
                window.removeEventListener('keydown', playerMove);
                startButton.addEventListener('click', gameReset);

            }

        }

        if (event.keyCode === 37) { // if left arrow is pressed, move left
            player.style.left = playerCurrentLeft - 20 + 'px';
            player.classList.add('flipImage')

        } else if (event.keyCode === 39) { // if right arrow is pressed, move right
            player.style.left = playerCurrentLeft + 20 + 'px';
            player.classList.remove('flipImage')


        } else if (event.keyCode === 32) { // if spacebar, store alphabets
            requestAPI();

        } else if (event.keyCode === 88) { // if x, clear stored alphabets
            clearBox();
        }
    }

    // store letter in word holder before checking
    var storeLetter = function() {
        if (document.getElementById('wordholder').textContent == "") {
            document.getElementById('wordholder').style.display = "block";
        }
        wordToCheck = newWord.join(''); // string array
        wordholder.textContent = wordToCheck; // append letters into wordholder box
    }

    // remove all stored letters
    var clearBox = function() {
        wordholder.textContent = ""; // reset parameters
        newWord = [];
        wordToCheck = "";
    }

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
            // $( "#wordholder" ).effect( "shake" );
            clearBox();
        }

    }

    var gameReset = function() {
        document.getElementById('player').style.backgroundImage = 'url("images/character1.png")';
        document.querySelector('.gameover').style.display = "none";
        startButton.style.display = "block";
        startButton.textContent = "Start Game";

        // clear all divs
        while (all.childNodes.length > 2) {
            all.removeChild(all.lastChild);
        }


        // clear previously stored letters
        clearBox();

        document.querySelector('.intro').style.display = "block";

        startButton.addEventListener('click', gameStart);
        window.addEventListener('keydown', playerMove);
        player.style.display = "none";
        player.style.top = "20vh";
        player.style.left = "45vw";


    }

    // listen for the request response
    request.addEventListener("load", responseHandler);
    request.addEventListener("error", requestFailed);


    startButton.addEventListener('click', gameStart);
    window.addEventListener('keydown', playerMove);

}