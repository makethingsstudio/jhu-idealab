<?php
  global $params;


  $context = Timber::get_context();


  $post = Timber::query_post(false, 'Challenges');


  $context['post'] = $post;


  $context['html_class'] = 'l-interior l-interior--challenge';
  $context['masthead_class'] = 'masthead--interior masthead--past-challenge';


  Timber::render( array( 'single-challenge.twig' ), $context );
