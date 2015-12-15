<?php
function json_cached_api_results($api_request ,$cache_file = NULL, $expires = NULL ) {
    global $request_type, $purge_cache, $limit_reached, $request_limit;

    if( !$cache_file ) $cache_file = WP_CONTENT_DIR . '/api-cache.json';
    if( !$expires) $expires = time() - 2*60*60;

    if( !file_exists($cache_file) ) die("Cache file is missing: $cache_file");

    // Check that the file is older than the expire time and that it's not empty
    if ( filectime($cache_file) < $expires || file_get_contents($cache_file)  == '' || $purge_cache && intval($_SESSION['views']) <= $request_limit ) {

        // File is too old, refresh cache
        $api_results = $api_request;
        $json_results = json_encode($api_results);

        // Remove cache file on error to avoid writing wrong xml
        if ( $api_results && $json_results )
            file_put_contents($cache_file, $json_results);
        else
            unlink($cache_file);
    } else {
        // Check for the number of purge cache requests to avoid abuse
        if( intval($_SESSION['views']) >= $request_limit )
            $limit_reached = " <span class='error'>Request limit reached ($request_limit). Please try purging the cache later.</span>";
        // Fetch cache
        $json_results = file_get_contents($cache_file);
        $request_type = 'JSON';
    }

    return json_decode($json_results);
}
