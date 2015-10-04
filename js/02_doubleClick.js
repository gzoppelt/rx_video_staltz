window.onload = function () {
    console.clear();

    var button = document.querySelector('button');
    var labelC = document.querySelector('.click');
    var labelD = document.querySelector('.doubleClick');

    labelC.textContent = '-';
    labelD.textContent = '-';

    var clickStream = Rx.Observable.fromEvent(button, 'click');

    //works:
    clickStream.subscribe(event => {labelC.textContent = 'click';});
    clickStream
        .throttle(1000)
        .subscribe(x => { labelC.textContent = '-'; });


    var doubleClickStream = clickStream
        .buffer(() => clickStream.throttle(350))
        .map(arr => arr.length)
        .filter(len => len === 2)
    ;


    doubleClickStream.subscribe(event => {
        labelD.textContent = 'double click';
    });

    doubleClickStream
        .throttle(1000)
        .subscribe(suggestion => {
            labelD.textContent = '-';
        })
    ;

}
