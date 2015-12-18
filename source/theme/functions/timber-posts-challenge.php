<?php
/*
* TOC
*
* Challenge
* - Get Related Projects
*/

// § Challenge
class Challenges extends TimberPost {
  // §§ Get Related Projects
  function get_related_projects() {
    $args = array(
      'post_type' => array(
        'project'
      ),
      'meta_query' => array(
        array(
          'key' => 'challenge',
          'value' => serialize(strval($this->ID)),
          'compare' => 'LIKE'
        )
      )
    );

    $related = Timber::get_posts($args, 'Projects');

    return $related;
  }

  public function projects() {
    $related = $this->get_related_projects();
    // if (is_array($related)) {
    //     array_splice($related, 0, $limit);
    // }
    return $related;
  }
}
