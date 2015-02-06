<?php

foreach (glob( dirname(__FILE__) . "/functions/*.php") as $filename)
{
    include $filename;
}

register_nav_menus( array(
  'primary' => 'Primary Site Navigation',
));

add_action('admin_menu', 'post_remove');
add_filter('timber_context', 'add_to_context');
