$(function () {
    // 制造扑克函数
    function makePoker() {
        var poker = [];
        var table = {};
        while (poker.length != 52) {
            // 数字
            var n = Math.ceil(Math.random() * 13);
            // 花色
            var c = Math.floor(Math.random() * 4);
            var colors = ['h', 's', 'c', 'd'];
            var cc = colors[c];
            var v = {
                number: n,
                color: cc
            }
            if (!table[n + cc]) {
                poker.push(v);
                table[n + cc] = true;
            }
        }
        return poker;
    }

    // 设置扑克牌
    function setPoker(poker) {
        var dict = {
            1: 'A',
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
            9: 9,
            10: 'T',
            11: 'J',
            12: 'Q',
            13: 'K'
        }
        var index = 0;
        for (var i = 0, poke; i < 7; i++) {
            for (var j = 0; j < i + 1; j++) {
                poke = poker[index];
                index++;
                $('<div>').addClass('pai').attr('data-number', poke.number)
                    .attr('id', i + '_' + j)
                    .appendTo('.scene')
                    .css({'background-image': 'url(./img/' + dict[poke.number] + poke.color + '.png)'})
                    .delay(50 * index)
                    .animate({
                        top: i * 35,
                        left: j * 130 + (6 - i) * 65 + 54,
                        opacity: 1
                    })
            }
        }
        console.log(index);
        // 下方扑克牌
        console.log(poker.length)
        for (; index < poker.length; index++) {
            poke = poker[index];
            // console.log(poke)
            // index++;
            $('<div>').addClass('pai left').attr('data-number', poke.number)
                .appendTo('.scene')
                .css({'background-image': 'url(./img/' + dict[poke.number] + poke.color + '.png)'})
                .delay(index * 50)
                .animate({
                    top: 400,
                    left: 190,
                    opacity: 1
                })
        }
        console.log(index)
    }

    // 向右移动
    var right = $('.scene .move-right');
    // console.log(right);
    var zIndex = 0;
    right.on('click', (function () {
        return function () {
            if ($('.left').length) {
                $('.left').last()
                    .css({'z-index': zIndex++})
                    .animate({
                        left: 690,
                    }, function () {
                        $(this).removeClass('left').addClass('right').dequeue();
                    })
            }
        }
    })())

    // 向左移动
    var left = $('.scene .move-left');
    left.on('click', (function () {
        var num = 1;
        return function () {
            if (num < 3 && !$('.left').length) {
                $('.right').each(function (i, v) {
                    $(this).delay(i * 200)
                        .css({'z-index': 0})
                        .animate({
                            left: 190
                        })
                        .queue(function () {
                            $(this).removeClass('right').addClass('left').dequeue();
                        })
                })
                num++;
            }
        }
    })())

    function getNumber(el) {
        return parseInt($(el).attr('data-number'));
    }

    // 判断是否被压住
    function isCanClick(el) {
        var x = parseInt($(el).attr('id').split('_')[0]);
        var y = parseInt($(el).attr('id').split('_')[1]);
        if ($('#' + (x + 1) + '_' + y).length || $('#' + (x + 1) + '_' + (y + 1)).length) {
            return false;
        }
        else {
            return true;
        }
    }

    // 前一张和当前
    var prev = null;
    // 事件委派
    $('.scene').on('click', '.pai', function () {
        //获取当前得分情况
        var score=parseInt($('.score .fen').text());
        var leave=parseInt($('.yu .leave').text());
        // 如果是上面的牌且被压住,直接返回
        if ($(this).attr('id') && !isCanClick(this)) {
            return;
        }
        // 点击谁加上一些标识,并且拿到点击的数字
        $(this).animate({
            'margin-top': -20
        })
        if (prev) {
            // 第二个非13的情况
            if (getNumber(prev) + getNumber(this) === 13) {
                prev.add(this)
                    .animate({
                        top: 0,
                        left: 880
                    })
                    .queue(function () {
                        $(this).detach().dequeue();
                    })
                $('.fen').text(score+=20);
                $('.leave').text(leave-=2);
            } else {
                $(this).animate({'margin-top': 0});
                prev.delay(400).animate({'margin-top': 0});
            }
            prev = null;
        }
        else {
            // 第一个非13的情况
            prev = $(this);
        }
        var number = getNumber(this);
        // 点到13
        if (number == 13) {
            $(this).animate({
                top: 0,
                left: 880
            })
                .queue(function () {
                    $(this).detach().dequeue();
                })
            $('.fen').text(score+=10);
            $('.leave').text(leave-=1);
            if(parseInt($('.leave').text())==0){
                alert('您已获胜！')
            }
            prev = null;
            return;
        }
    })
    // 开始游戏
    var start = $('.start');

    function move() {
        // 调用函数
        setPoker(makePoker());
    }

    start.on('click', function () {
        move();
        right.animate({'opacity': 1});
        left.animate({'opacity': 1});
    })
    // 重新开始
    var restart = $('.restart');
    var againname = function () {
        $('.scene .pai').remove();
    }
    restart.on('click', function () {
        againname();
        move();
        $('.fen').text(0);
        $('.leave').text(52);
    })
    // 点击关闭
    var end = $('.end');
    end.on('click', function () {
        alert('您确定要退出游戏吗?');
        againname();
        $('.fen').text(0);
        $('.leave').text(52);
        // window.close();
    })

})
