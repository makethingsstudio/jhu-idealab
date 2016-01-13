var gemini = require('gemini');

gemini.suite('home', function(home) {
    home.setUrl('/')
        .setCaptureElements(
          [
            'body',
          ]
        )
        .capture('small-p-plain', function(actions, find) {
          actions.setWindowSize(320,480)
          actions.wait(2000);
        })
        .capture('medium-p-plain', function(actions, find) {
          actions.setWindowSize(768,1024)
          actions.wait(2000);
        })
        .capture('medium-l-plain', function(actions, find) {
          actions.setWindowSize(1024,768)
          actions.wait(2000);
        })
        .capture('large-l-plain', function(actions, find) {
          actions.setWindowSize(1280,1024)
          actions.wait(2000);
        });
});
