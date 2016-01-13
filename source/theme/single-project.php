<?php
  global $params;


  $context = Timber::get_context();


  $post = Timber::query_post(false, 'Projects');


  $context['post'] = $post;


  $context['challenge'] = $post->challenge_details;


  $context['html_class'] = 'l-interior l-interior--idea';
  $context['masthead_class'] = 'masthead--interior masthead--past-challenge';


  Timber::render( array( 'single-project.twig' ), $context );
