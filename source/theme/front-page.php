<?php
  /**
   * Front Page
   * This page displays for the entry set as "Front Page" in
   * the Reading Settings page
   *
   * @link https://codex.wordpress.org/Template_Hierarchy
   * @package IdeaLab
   * @since IdeaLab 0.1.0
   */





if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}





/*
   §§ Page Details
   ========================================================================== */
$context['html_class'] = 'l-interior';
$context['masthead_class'] = 'masthead--interior';





/*
   §§ Page Content
   ========================================================================== */
$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;





/*
   §§ Challenge Content
   ========================================================================== */
$current_challenges_arr = array(
  'order'          => 'asc',
  'orderby'        => 'date',
  'post_type'      => 'challenge',
  'posts_per_page' => -1,
  'meta_query' => array(
    array(
        'key' => 'challenge_status', // name of custom field
        'value' => 1, // matches exactly "red"
        // 'compare' => 'LIKE'
    )
  )
);


$context['current_challenges'] = Timber::get_posts( $current_challenges_arr );


$past_challenges_arr = array(
  'order'          => 'asc',
  'orderby'        => 'date',
  'post_type'      => 'challenge',
  'posts_per_page' => 5,
  'meta_query' => array(
    array(
        'key' => 'challenge_status', // name of custom field
        'value' => 1, // matches exactly "red"
        'compare' => '!='
    )
  )
);


$context['past_challenges'] = Timber::get_posts( $past_challenges_arr, 'Challenges' );


$context['challenge_statement'] = get_field( 'challenge_statement', 'options' );



/*
   §§ About
   ========================================================================== */
$context['info_title'] = get_field('area_title', 'options');
$context['info_content'] = get_field('area_content', 'options');




$templates = array('index.twig');
if (is_front_page()){
  $context['html_class'] = 'l-home';
  $context['masthead_class'] = 'masthead--has-full-bg masthead--has-hero';
  array_unshift($templates, 'home.twig');
}
Timber::render($templates, $context);
