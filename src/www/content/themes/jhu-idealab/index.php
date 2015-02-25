<?php

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
$context['info_title'] = get_field('info_title', 'options');
$context['info_content'] = get_field('info_content', 'options');
$context['challenges'] = get_field('challenges', 'options');
//$context['challenges'] = json_cached_api_results(ideaScaleCampaigns());
$context['html_class'] = 'l-interior';
$templates = array('index.twig');
if (is_front_page()){
  $context['html_class'] = 'l-home';
  $context['masthead_class'] = 'masthead--has-full-bg masthead--has-hero';
  array_unshift($templates, 'home.twig');
}
Timber::render($templates, $context);
