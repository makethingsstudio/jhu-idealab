<?php
/**
 * Template Name: Current Challenges
 */


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


$context['challenge_statement'] = get_field( 'challenge_statement', 'options' );


$context['html_class'] = 'l-interior l-interior--challenges l-interior--current-challenges';
$context['masthead_class'] = 'masthead--interior masthead--current-challenge';


Timber::render( 'template-challenges.twig', $context );
