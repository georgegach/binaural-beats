$(document).ready(function () {

    var freqSlider = document.getElementById('freqSlider');
    noUiSlider.create(freqSlider, {
        start: [70, 75],
        connect: true,
        step: 0.1,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        range: {
            'min': 60,
            'max': 110
        },
        pips: { mode: 'count', values: 11, density: 2},
        format: wNumb({
            decimals: 1
        })
    });

    var pips = freqSlider.querySelectorAll('#freqSlider .noUi-value');

    function clickOnPip() {
        var value = Number(this.innerHTML);
        var vals = freqSlider.noUiSlider.get().map(v => Number(v))
        res = Math.abs(vals[0] - value) < Math.abs(vals[1] - value) ? [vals[1], value] : [vals[0], value]
        res = res.sort((a, b) => a - b)
        freqSlider.noUiSlider.set(res);
    }

    for (var i = 0; i < pips.length; i++) {
        pips[i].style.cursor = 'pointer';
        pips[i].addEventListener('click', clickOnPip);
        pips[i].addEventListener('touchstart', clickOnPip);
    }

    var volSlider = document.getElementById('volSlider');
    noUiSlider.create(volSlider, {
        start: 20,
        connect: [true, false],
        step: 1,
        orientation: 'horizontal', // 'horizontal' or 'vertical'
        range: {
            'min': 0,
            'max': 100
        },
        format: wNumb({
            decimals: 0
        })
    });


    window.bb = {
        obj: null,
        init: false,
        ctx: null,
        volume: null,
        rangeValues : [3,8,12,32,100],
        rangeColors : ["#DD2C00", "#6200EA", "#0091EA", "#00BFA5", "#FFAB00"],
        freqSelects : [1, 5, 10, 20, 40]
    }


    function initiate() {
        if (!window.bb.init) {
            window.bb.ctx = new AudioContext();
            window.bb.obj = new Beats(window.bb.ctx);
            window.bb.volume = window.bb.ctx.createGain();
            window.bb.obj.connect(window.bb.volume)
            window.bb.volume.connect(window.bb.ctx.destination)
            window.bb.volume.gain.value = Number(volSlider.noUiSlider.get())/100
            window.bb.init = true
        }
    }

    volSlider.noUiSlider.on('update', function(e) {
        if (window.bb.obj != null)
            window.bb.volume.gain.value = e/100;
    })



    var waves = document.querySelectorAll('.wave')
    for (let i = 0; i < waves.length; i++) {
        waves[i].addEventListener('click', function(e) {
            var vals = freqSlider.noUiSlider.get().map(v => Number(v))
            var sum = vals[0]+window.bb.freqSelects[i]
            if (sum <= 110)
                freqSlider.noUiSlider.set([vals[0],sum])
            else
                freqSlider.noUiSlider.set([vals[0]-(sum-110),110])

        })
    }

    function updateColor(v) {
        var diff = Math.round(Math.abs(v[0] - v[1])*10)/10;
        for (let i=0; i < window.bb.rangeValues.length; i++){
            if (diff < window.bb.rangeValues[i])
            {
                $('#freqSlider .noUi-connect').css('background-color',window.bb.rangeColors[i]);
                $('#freqSlider .noUi-tooltip').css('background-color',window.bb.rangeColors[i]);
                $('#freqSlider .noUi-handle').css('background-color',window.bb.rangeColors[i]);
                $('#pulsar').css('background-color',window.bb.rangeColors[i]);
                $('.waveform').removeClass('active')
                $('.waveform:eq('+i+')').addClass('active')
                $('#pulsar').css('animation-duration', 1/diff + 's')
                $('#beats')[0].innerHTML = diff + ' Hz'
                break
            }
        }
    };

    freqSlider.noUiSlider.on('update', function(e) {
        if (window.bb.obj != null)
            window.bb.obj.setFrequencies(e.map(v => Number(v)))
            updateColor(e.map(v => Number(v)))
    })

    $('#playBtn').click(function () {
        initiate()
        window.bb.obj.start()
        window.bb.obj.setFrequencies(freqSlider.noUiSlider.get().map(v => Number(v)))
        $('#pulsar').addClass('active')
        $('#stopBtn').removeClass('hide')
        $('#playBtn').addClass('hide')

    })

    $('#stopBtn').click(function () {
        window.bb.obj.stop()
        window.bb.init = false;
        $('#pulsar').removeClass('active')
        $('#playBtn').removeClass('hide')
        $('#stopBtn').addClass('hide')
    })

    $('#volUp').click(function () {
        volSlider.noUiSlider.set(Number(volSlider.noUiSlider.get())+5)
    })

    $('#volDown').click(function () {
        volSlider.noUiSlider.set(Number(volSlider.noUiSlider.get())-5)
    })


})