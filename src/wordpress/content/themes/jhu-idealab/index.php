<?php

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['info_title'] = get_field('info_title', 'options');
$context['info_content'] = get_field('info_content', 'options');
$context['challenges'] = ideaScaleCampaigns();

$templates = array('index.twig');
if (is_front_page()){
  $context['masthead_class'] = 'masthead--has-full-bg masthead--has-hero';
  array_unshift($templates, 'home.twig');
}
Timber::render($templates, $context);
