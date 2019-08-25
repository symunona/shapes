window.onload = function () {

    var frameTime = 400;
    var minFrameTime = 10;
    var delta = 10;

    setTimeout(anim, frameTime)

    var gridX = 4; gridY = 16; cnt = 0;

    function anim() {
        cnt++;
        var x = Math.floor(Math.random() * gridX);
        var y = Math.floor(Math.random() * gridY);
        var className = 'window-' + y + '-' + x;
        var elements = document.getElementsByClassName(className);

        var color = getRandomMonoColor();
        for (i = 0; i < elements.length; i++) {
            elements[i].style.fill = color;
        }

        if (cnt % 10 === 0) {
            var element = document.getElementById('floor-' + y);
            element.style.fill = getRandomColor('ABCDEF')
        }
        if (minFrameTime < frameTime) {
            frameTime -= delta;
        }

        setTimeout(anim, frameTime)
    }

    function getRandomColor(letters) {
        letters = letters || '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }
    function getRandomMonoColor(letters) {
        letters = letters || '0123456789ABCDEF';
        let color = '';
        for (var i = 0; i < 1; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        color = '#' + color + color + color;
        return color;
    }
}
