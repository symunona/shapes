window.onload = function () {

    var frameTime = 40;
    var minFrameTime = 10;
    var delta = 10;
    var element = document.getElementById('shape-77')

    setTimeout(anim, frameTime)

    var gridX = 21; gridY = 15; cnt = 0;

    function anim() {
        cnt++;
        var x = random.int(0, gridX);
        var y = random.int(0, gridY);

        var className = 'sq-' + x + '-' + y;

        var elements = document.getElementsByClassName(className);

        var color = getRandomColor2();

        for (i = 0; i < elements.length; i++) {
            elements[i].style.fill = color;
        }

        if (minFrameTime < frameTime) {
            frameTime -= delta;
        }

        setTimeout(anim, frameTime)
    }

    function getRandomColor2(){
        var dist = {
            0.8: getRandomMonoColor.bind(this, '012345'),
            0.17: getRandomMonoColor.bind(this),
            0.03: getRandomColor.bind(this)
        }
        return random.dist(dist);
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

var random = {
    int: function (min, max) {
        return Math.floor(min + Math.random() * (max - min))
    },
    /**
     * i.e. {
     *  0.5: function
     *  0.3: function
     *  0.1: function
     * }
     * @param {Object} dist
     */
    dist: function(dist){
        var rnd = Math.random();
        var probsum = 0
        for (var probability in dist){
            var floatProbablility = parseFloat(probability);
            if (probsum <= rnd && rnd < probsum + floatProbablility){
                return dist[probability]()
            }
            probsum += parseFloat(probability);
        }
    }
}
