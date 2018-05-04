(function () {

    var target = document.getElementById('target');
    var watchId;

    function appendLocation(location, verb) {
        verb = verb || 'atualizada';
        var newLocation = document.createElement('p');
        newLocation.innerHTML = 'Localização ' + verb + ': <a href="https://maps.google.com/maps?&z=15&q=' + location.coords.latitude + '+' + location.coords.longitude + '&ll=' + location.coords.latitude + '+' + location.coords.longitude + '" target="_blank">' + location.coords.latitude + ', ' + location.coords.longitude + '</a>';
        target.appendChild(newLocation);
    }

    if ('geolocation' in navigator) {
        document.getElementById('askButton').addEventListener('click', function () {
            navigator.geolocation.getCurrentPosition(function (location) {
                appendLocation(location, 'encontrada');
            });
            watchId = navigator.geolocation.watchPosition(appendLocation);
        });
    } else {
        target.innerText = 'Geolocation API não suportada para este browser.';
    }

})();