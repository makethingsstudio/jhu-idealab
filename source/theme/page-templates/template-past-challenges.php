<?php
/**
 * Template Name: Past Challenges
 */


$context = Timber::get_context();


$post = new TimberPost();
$context['post'] = $post;


/*
   §§ Challenge Content
   ========================================================================== */
   $past_challenges_arr = array(
     'order'          => 'DESC',
     'orderby'        => 'meta_value_date',
     'post_type'      => 'challenge',
     'posts_per_page' => -1,
     'meta_type' => 'DATE',
     'meta_key'  => 'challenge_end_date',
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


$context['html_class'] = 'l-interior l-interior--challenges l-interior--current-challenges';
$context['masthead_class'] = 'masthead--interior masthead--current-challenge';


Timber::render( 'template-challenges-past.twig', $context );
