<?php
if ( ! class_exists( 'Timber' ) ) {
  add_action( 'admin_notices', function() {
      echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
    } );
  return;
}


Timber::$dirname = array('templates', 'views');


class StarterSite extends TimberSite {

  function __construct() {
    // add_theme_support( 'post-formats' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'menus' );
    add_filter( 'timber_context', array( $this, 'add_to_context' ) );
    // add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
    add_action( 'init', array( $this, 'register_post_types' ) );
    add_action( 'init', array( $this, 'register_taxonomies' ) );
    add_action( 'init', array( $this, 'register_menus' ) );
    add_action( 'admin_menu', array( $this, 'remove_posts' ) );
    add_action( 'init', array( $this, 'add_option_page') );
    parent::__construct();
  }

  function add_option_page() {
    if( function_exists('acf_add_options_page') ) {
      acf_add_options_page();
    }
  }

  function register_post_types() {
    //this is where you can register custom post types
  }

  function register_taxonomies() {
    //this is where you can register custom taxonomies
  }

  function register_menus() {
    register_nav_menus( array(
      'primary' => 'Primary Site Navigation',
    ) );
  }

  function remove_posts() {
    remove_menu_page('edit.php');
  }

  function add_to_context( $context ) {
    $context['primary'] = new TimberMenu('primary');
    $context['site'] = $this;

    return $context;
  }

  function add_to_twig( $twig ) {
    /* this is where you can add your own fuctions to twig */
    // $twig->addExtension( new Twig_Extension_StringLoader() );
    // $twig->addFilter( 'myfoo', new Twig_Filter_Function( 'myfoo' ) );
    return $twig;
  }

}

new StarterSite();





foreach (glob( dirname(__FILE__) . "/functions/*.php") as $filename)
{
    include $filename;
}
