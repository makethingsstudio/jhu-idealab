<?php
/*
* TOC
*
* Challenge
* - Get Related Projects
*/

// § Project
class Projects extends TimberPost {
  // §§ Get Project Details

  function get_project_details() {
    $related = ideaScaleIdea( $this->idea_id );
    return $related;
  }

  function get_challenge_details() {
    // $args = array(
    //   'post_type' => array(
    //     'challenge'
    //   ),

    // );
    //
    $challenge_post = get_field( 'challenge', $this->ID );

    return new TimberPost( $challenge_post[0]->ID );
  }

  public function details() {
    $related = $this->get_project_details();
    // if (is_array($related)) {
    //     array_splice($related, 0, $limit);
    // }
    return $related;
  }

  public function challenge_details() {
    $related = $this->get_challenge_details();
    // if (is_array($related)) {
    //     array_splice($related, 0, $limit);
    // }
    return $related;
  }
}
