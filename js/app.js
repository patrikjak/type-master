$(function () {

    function open(click, open) {
        click.on('click', function () {
            open.fadeIn(500);
        });
    }

    function close(click, close) {
        click.on('click', function () {
            close.fadeOut(500);
        });
    }

    function generateRandomString(length = 1) {
        var result = '',
            characters;

        if (difficulty === 'easy') {
            characters = 'QWERTZUIOPLKJHGFDSAYXCVBNMqwertzuioplkjhgfdsayxcvbnm';
        }
        else if (difficulty === 'moderate') {
            characters = 'QWERTZUIOPLKJHGFDSAYXCVBNMqwertzuioplkjhgfdsayxcvbnmĽŠČŤŽľščťžÝÁÍÚýáíäúô';
        }
        else if (difficulty === 'hard') {
            characters = 'QWERTZUIOPLKJHGFDSAYXCVBNMqwertzuioplkjhgfdsayxcvbnmĽŠČŤŽľščťžÝÁÍÚýáíäôú0123456789,.-"/|~;%+-*&#@{}[]()!?:_$';
        }

        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }

    function starterPack() {
        $('#string').text(stringsArray[level]);
        input.val('');
        input.focus();
    }

    function loadStrings(count) {
        for (i = 1; i <= count; i++) {
            stringsArray.push(generateRandomString(i));
        }
    }

    function getAnswer() {
        if (stringsArray[level] === input.val()) {
            level++;
            if (difficulty === 'easy') {
                setBestScore('best_score_easy');
            }
            else if (difficulty === 'moderate') {
                setBestScore('best_score_moderate');
            }
            else if (difficulty === 'hard') {
                setBestScore('best_score_hard');
            }
            levelEl.text(level);
            starterPack();
            fastMessage('Výborne, len tak ďalej :)', true);
        }
        else {
            starterPack();
            fastMessage('Hopa, niekde je chybička, skús to znova :(', false);
        }
    }

    function setBestScore(bestScoreDiff) {
        if (localStorage.getItem(bestScoreDiff) < level) {
            bestScore = level;
            window.localStorage.setItem(bestScoreDiff, (bestScore).toString());
        }
    }

    function fastMessage(message, status) {
        messageEl.text(message);
        if (status === true) {
            messageEl.css('background-color', '#598234');
            playAudio('https://www.soundjay.com/misc/bell-ringing-04.mp3');
        }
        else {
            messageEl.css('background-color', '#ff2236');
            playAudio('https://www.soundjay.com/misc/fail-buzzer-01.mp3');
        }
    }

    function playAudio(src) {
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', src);
        audioElement.play();
    }

    function stopwatch(seconds) {
        var timer = setInterval(function () {
            seconds--;
            timerEl.text(seconds);
            if (seconds === 0) {
                clearInterval(timer);
                end();
            }
        }, 1000);
    }

    function setScores (element, scoreItem) {
        if (localStorage.getItem(scoreItem) === null) {
            $(element).text('Ešte ste nehrali');
        }
        else {
            $(element).text(localStorage.getItem(scoreItem));
        }
    }

    function end() {
        $('#end').fadeIn(500, function () {
            playAudio('https://www.soundjay.com/misc/fail-trombone-03.mp3');
            $('#score').text(level);
            setTimeout(function () {
                window.location.reload();
            }, 5000);
        });
    }

    var whatOverlay = $('#what-overlay'),
        difficultyOverlay = $('#difficulty');

    open($('#what'), whatOverlay);
    open($('#play'), difficultyOverlay);
    close($('#close'), whatOverlay)
    close($('#cancel'), difficultyOverlay);


    var difficulty,
        stringsArray = [],
        level = 0,
        i;

    var input = $('#typedText');

    var timerEl = $('#timer'),
        levelEl = $('#level'),
        messageEl = $('#info');

    var bestScore = 0;

    difficultyOverlay.find('.diff').on('click', function () {
        $('.intro').fadeOut(500);
        $('#difficulty').fadeOut(500);
        difficulty = $(this).attr('data-diff');
        loadStrings(150);
        setTimeout(function () {
            $('.playground').fadeIn(500);
            starterPack();
        },1000);
        $('#submit').on('click', getAnswer);
        stopwatch(180);
        input.on('keydown', function (e) {
            if (e.keyCode === 13) {
                e.preventDefault();
                getAnswer();
            }
        });
    });

    setScores('.intro #max-level-easy', 'best_score_easy');
    setScores('.intro #max-level-moderate', 'best_score_moderate');
    setScores('.intro #max-level-hard', 'best_score_hard');

});