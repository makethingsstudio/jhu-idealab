<?php
function ideaScaleIdea($id) {
  $ch = curl_init();
  $title      = apply_filters('widget_title', $instance['title']);
  $community_url  = 'https://myidealab.jhu.edu';
  $api_key    = 'd3a96aed-3e5f-466c-a7a0-f7600ca57515';

  // Set url
  curl_setopt($ch, CURLOPT_URL, $community_url . '/a/rest/v1/ideas/' . $id );

  // Set method
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');

  // Set options
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

  // Set headers
  curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31",
    "api_token: " . $api_key,
    "Accept-language: en",
   ]
  );

  // Send the request & save response to $resp
  $resp = curl_exec($ch);

  if(!$resp) {
    die('Error: "' . curl_error($ch) . '" - Code: ' . curl_errno($ch));
  } else {
    $data = json_decode($resp);
  }

  // Close request to clear up some resources
  curl_close($ch);

  return $data;
}
