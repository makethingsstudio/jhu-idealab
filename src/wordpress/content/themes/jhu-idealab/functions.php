<?php

function post_remove ()
{
  remove_menu_page('edit.php');
}

add_action('admin_menu', 'post_remove');
