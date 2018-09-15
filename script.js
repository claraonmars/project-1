var scrollDistancePerSecond = 100; // Scroll 50px every second.
var scrollDistancePerAnimationFrame = Math.ceil(scrollDistancePerSecond  / 60); // Animate at 60 fps.
var wrapper = document.getElementById('wrapper');
var startButton = document.querySelector('button');
var last = document.getElementById('last');
var playerArea = document.getElementById('playerArea');

var gameStart = function(){
    playerArea.style.display="block";
    startButton.style.display="none";
    autoScroll(wrapper);
}

var autoScroll = function(element){
    if (element.scrollTop < element.scrollHeight){
    window.requestAnimationFrame(autoScroll.bind(null,element));
    element.scrollTop += scrollDistancePerAnimationFrame;
    }

    if (element.scrollTop === element.scrollHeight - last.offsetHeight){
        var continuous = document.createElement('div');
        continuous.classList.add("landscape");
        wrapper.appendChild(continuous);
    }
}

var playerMoveLeft = function(){
    var value = 0;
    value += 200;
    // var playerCurrentLeft = parseInt(document.getElementById('player').style.left) -10;
    // var playerCurrentRight = parseInt(document.getElementById('player').style.right) + 10;
    document.getElementById('player').style.left = value + 'px';

}


startButton.addEventListener('click', gameStart);
document.body.addEventListener('keydown', playerMoveLeft);

