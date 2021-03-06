window.onload = function () {
    var refreshButton = document.querySelector('.refresh');
    var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

    var startupRequestStream = Rx.Observable.just('https://api.github.com/users');

    var requestOnRefreshStream = refreshClickStream
        .map(event => {
            var randomOffset = Math.floor(Math.random()*500);
            return 'https://api.github.com/users?since=' + randomOffset;
        })
    ;

    var responseStream = requestOnRefreshStream.merge(startupRequestStream)
        .flatMap(
            requestUrl => {
                console.log('do network request <== 3 of those');
                return Rx.Observable.fromPromise(jQuery.getJSON(requestUrl));
            }
        )
    ;

    function createSuggestionStream(responseStream) {
        return responseStream.map(
            listUser => listUser[Math.floor(Math.random() * listUser.length)]
        )
        .startWith(null)                                // *** new
        .merge(refreshClickStream.map(event => null))   // *** new
        ;
    }

    var suggestion1Stream = createSuggestionStream(responseStream);
    var suggestion2Stream = createSuggestionStream(responseStream);
    var suggestion3Stream = createSuggestionStream(responseStream);

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
    suggestion2Stream.subscribe(user => { renderSuggestion(user, '.suggestion3') });
}
