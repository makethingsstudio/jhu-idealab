/* global $, Zepto */
'use strict';

var library;
var CHALLENGES;


function library(module) {
  $(function () {
    if (module.init) {
      // module.init();
    }
  });

  return module;
}



CHALLENGES = (library(function ($) {
  var apiUrl = 'https://jhu.ideascale.com/a/rest/v1';
  var apiKey = 'd3a96aed-3e5f-466c-a7a0-f7600ca57515';
  var campaignEndpoint = apiUrl + '/campaigns';
  var settings;
  var initChallenges;
  var bindUi;
  var getData;

  settings = {
    campaigns: {}
  };

  bindUi = function () {
    console.log($('body'));
  };

  initChallenges = function () {
    bindUi();
  };

  getData = function () {
    $.ajax({
      type: 'GET',
      url: campaignEndpoint,
      headers: {
        'api_key': apiKey
      },
      dataType: 'jsonp',
      success: function(data){
          // Supposing this JSON payload was received:
          //   {"project": {"id": 42, "html": "<div>..." }}
          // append the HTML to context object.
          console.log(data);
        },
        error: function(xhr, type){
          console.log(xhr, type, 'info');
        }
    });
  };

  return {
    options: settings,
    init: initChallenges()
  };
})(Zepto));
