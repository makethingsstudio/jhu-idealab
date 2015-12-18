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

  public function details() {
    $related = $this->get_project_details();
    // if (is_array($related)) {
    //     array_splice($related, 0, $limit);
    // }
    return $related;
  }
}
