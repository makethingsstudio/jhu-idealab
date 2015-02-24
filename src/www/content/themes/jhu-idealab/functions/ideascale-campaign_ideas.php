<?php
function ideaScaleIdeas($campaign) {
    $title      = apply_filters('widget_title', $instance['title']);
    $community_url  = 'https://myidealab.jhu.edu';
    $api_key    = 'd3a96aed-3e5f-466c-a7a0-f7600ca57515';

    $opts = array(
      'http'=>array(
        'method'=>"GET",
        'header'=>"Accept-language: en\r\n" .
                  "Cookie: foo=bar\r\n" .
                  "api_token: ".$api_key."\r\n".
                  "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31\r\n"
      )
    );
    $context = stream_context_create($opts);
    // Open the file using the HTTP headers set above
    $file = file_get_contents($community_url . '/a/rest/v1/campaigns', false, $context);
    $data = json_decode($file);

    return $data;
}
