<?php
Timber::add_route('challenge/:project/ideas/:slug', function($params){

  $query = array(
    'post_type' => 'project',
    'name'  => $params['slug']
  );
  Timber::load_template('single-project.php', $query, 200, $params);
});
