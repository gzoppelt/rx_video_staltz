window.onload = function () {
    var requestStream = Rx.Observable.just('https://api.github.com/users');

    requestStream.subscribe(requestUrl => {
        jQuery.getJSON(requestUrl).done(response => {
            console.log('traditional way - jQuery.getJSON returns a promise:\n', response);
        });
    });

    requestStream.subscribe(requestUrl => {
        var responseStream = Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
        responseStream.subscribe(response  => {
            console.log('now subscibed to the responseStream:\n', response);
        });
    });

    //now there is a subscribe inside a subscribe, looks like callback hell
    //better:
    var responseStream = requestStream
        .map(requestUrl =>
            Rx.Observable.fromPromise(jQuery.getJSON(requestUrl))
        )
    ;

    //responseStream is now a stream of streams, each event in the requestStream
    //is mapped to an Observable (new stream), flatMap flattens this, reacts like
    //promise.then():
    var responseStream = requestStream
        .flatMap(requestUrl =>
            Rx.Observable.fromPromise(jQuery.getJSON(requestUrl))
        )
    ;

    responseStream.subscribe(response  => {
        console.log('now flatly subscibed to the responseStream:\n', response);
    });
}
