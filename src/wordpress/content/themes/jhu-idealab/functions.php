<?php

foreach (glob( dirname(__FILE__) . "/functions/*.php") as $filename)
{
    include $filename;
}


add_action('admin_menu', 'post_remove');
