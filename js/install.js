(function () {
  'use strict';

  var deferredPrompt;
  var installApp = document.getElementById('install-app');

  window.addEventListener('beforeinstallprompt', function (e) {
    console.log('beforeinstallprompt Event fired');
    e.preventDefault();
    deferredPrompt = e;

    installApp.style.visibility = 'visible';

    return false;
  });

  installApp.addEventListener('click', function () {
    if (deferredPrompt !== undefined) {
      // The user has had a postive interaction with our app and Chrome
      // has tried to prompt previously, so let's show the prompt.
      deferredPrompt.prompt();

      // Follow what the user has done with the prompt.
      deferredPrompt.userChoice.then(function (choiceResult) {

        console.log(choiceResult.outcome);

        if (choiceResult.outcome == 'dismissed') {
          console.log('User cancelled home screen install');
        }
        else {
          console.log('User added to home screen');
        }

        // We no longer need the prompt.  Clear it up.
        deferredPrompt = null;
      });
    }
  });
})();