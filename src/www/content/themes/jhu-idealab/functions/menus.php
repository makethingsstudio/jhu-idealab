<?php

function add_to_context($data){
    /* So here you are adding data to Timber's context object, i.e... */
    /* Now, in similar fashion, you add a Timber menu and send it along to the context. */
    $data['primary'] = new TimberMenu('primary'); // This is where you can also send a Wordpress menu slug or ID
    return $data;
}
