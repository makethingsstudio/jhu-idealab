var gemini = require('gemini');

gemini.suite('home', function(suite) {
    suite.setUrl('/')
        .setCaptureElements(
          [
            '.hero--mast',
            '.cc-section'
          ]
        )
        .capture('plain', function(actions, find) {
            actions.wait(2000);
        });
});
