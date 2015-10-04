window.onload = function () {
    var refreshButton = document.querySelector('.refresh');
    var closeButton1  = document.querySelector('.close1');
    var closeButton2  = document.querySelector('.close2');
    var closeButton3  = document.querySelector('.close3');
    var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

    var startupRequestStream = Rx.Observable.just('https://api.github.com/users');
    var close1Clicks = Rx.Observable.fromEvent('closeButton1');
    var close2Clicks = Rx.Observable.fromEvent('closeButton2');
    var close3Clicks = Rx.Observable.fromEvent('closeButton3');

    var requestOnRefreshStream = refreshClickStream
        .map(event => {
            var randomOffset = Math.floor(Math.random()*500);
            return 'https://api.github.com/users?since=' + randomOffset;
        })
    ;

    var requestStream = startupRequestStream.merge(requestOnRefreshStream);
    var responseStream = requestStream.flatMap(
            requestUrl => {
                console.log("do network request <== hapenhs now only once per refresh");
                return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
            }
        ).shareReplay(1)
    ;

    // refreshClickStream:  ------f-------------->
    // requestStream:       r-----r-------------->
    // responseStream:      ---R-----R----------->
    // closeClickStream:    -------------x------->
    // suggestion1Stream:   N--u--N--u---u------->

    function getRandomUser(listUsers) {
        return listUsers[Math.floor(Math.random() * listUsers.length)];
    }

    function createSuggestionStream(responseStream, closeClickStream) {
        return
            responseStream
                .map(getRandomUser)
                .startWith(null)
                .merge(refreshClickStream.map(ex => null))
                .merge(closeClickStream
                    .withLastestFrom(
                        responseStream,
                        (x, R) => getRandomUser(R)
                    )
                )
        ;
    }

    var suggestion1Stream = createSuggestionStream(responseStream, close1Clicks);
    var suggestion2Stream = createSuggestionStream(responseStream, close2Clicks);
    var suggestion3Stream = createSuggestionStream(responseStream, close3Clicks);

    function renderSuggestion(userData, selector) {
        var element = document.querySelector(selector);
        if (userData === null) {
            element.style.visibility = 'hidden';
        } else {
            element.style.visibility = 'visible';
            var usernameEl = element.querySelector('.username');
            usernameEl.href = userData.html_url;
            usernameEl.textContent = userData.login;
            var imgEl = element.querySelector('img');
            imgEl.src = userData.avatar_url;
        }
    }

    suggestion1Stream.subscribe(user => { renderSuggestion(user, '.suggestion1') });
    suggestion2Stream.subscribe(user => { renderSuggestion(user, '.suggestion2') });
    suggestion3Stream.subscribe(user => { renderSuggestion(user, '.suggestion3') });
}
