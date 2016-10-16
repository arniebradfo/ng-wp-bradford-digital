<?php
/**
 * @package    	WordPress
 * @subpackage 	wpajax
 * @since      	0.1.0
 * @author     	James Bradford &lt;james@polaris.graphics&gt;
 * @copyright  	Copyright (c) 2016, James Bradford
 * @link       	https://github.com/arniebradfo/wpajax-Theme
 * @license    	http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

	// Detect localhost dev environment
	$GLOBALS['isDev'] = strpos(home_url(), 'localhost');

	// Detect ajax request (https://rosspenman.com/pushstate-part-2/)
	$GLOBALS['is_ajax'] = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') ? true : false ;
	$GLOBALS['is_ajax_post_comment'] = (!empty($_SERVER['HTTP_WP_REQUEST_TYPE']) && strtolower($_SERVER['HTTP_WP_REQUEST_TYPE']) == 'postcomment') ? true : false ;

	// detect differet types of wordpress ajax requests by setting a header in the js call
	$GLOBALS['is_ajax_get_page'] = (!empty($_SERVER['HTTP_WP_REQUEST_TYPE']) && strtolower($_SERVER['HTTP_WP_REQUEST_TYPE']) == 'getpage') ? true : false ;
	$GLOBALS['is_ajax_get_posts'] = (!empty($_SERVER['HTTP_WP_REQUEST_TYPE']) && strtolower($_SERVER['HTTP_WP_REQUEST_TYPE']) == 'getposts') ? true : false ;
	$GLOBALS['is_ajax_get_comments'] = (!empty($_SERVER['HTTP_WP_REQUEST_TYPE']) && strtolower($_SERVER['HTTP_WP_REQUEST_TYPE']) == 'getcommentssection') ? true : false ;


	// runs through all .php partials in /_/php/
	foreach (scandir(dirname(__FILE__).'/_/php') as $filename) {
		$path = dirname(__FILE__).'/_/php/' . $filename;
		if ( is_file($path) && pathinfo($path,PATHINFO_EXTENSION) == 'php') {
			require_once $path;
		}
	}

	function wpajax_add_query_vars_filter( $vars ){
	  $vars[] = "wpajax";
	  return $vars;
	}
	add_filter( 'query_vars', 'wpajax_add_query_vars_filter' );


	// http://www.inkthemes.com/ajax-comment-wordpress/
	function wpajax_load_comment($comment_ID, $comment_status) {
		if ($GLOBALS['is_ajax']) {
			switch ($comment_status) {
				case '0': //notify moderator of unapproved comment
					wp_notify_moderator( $comment_ID );
					break;
				case '1': //Approved comment
					single_comment( $comment_ID );
					wp_notify_postauthor( $comment_ID );
					break;
				default: // $comment_status was null
					echo "error";
			}
			exit; // better than wp_die() ?
		}
	}
	add_action('comment_post', 'wpajax_load_comment', 25, 2);


	// Theme Setup (based on twentythirteen: http://make.wordpress.org/core/tag/twentythirteen/)
	function wpajax_theme_setup() {

		load_theme_textdomain( 'wpajax', get_template_directory() . '/languages' );

		add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-formats', array( 'link', 'video', 'aside', 'audio', 'chat', 'gallery', 'image', 'quote', 'status' ) );
		add_post_type_support( 'post', 'post-formats' );
		add_post_type_support( 'page', 'post-formats' );

		// Nav Menus
		register_nav_menus( array(
			'primary'   => __( 'Navigation Menu', 'wpajax' ),
			'footer' => __( 'Footer Menu', 'wpajax' ),
		) );

		// featured images aka thumbnails
		add_theme_support( 'post-thumbnails' );
		set_post_thumbnail_size( 150, 150, true ); // default Post Thumbnail dimensions: 150px width x 150px height (cropped)
		update_option( 'thumbnail_size_w', 150 ); // don't depend on these
		update_option( 'thumbnail_size_h', 150 ); // the size of these can be edited by the user

		// add image and manage image sizes
		add_image_size( 'small', 100 );
		update_option( 'medium_size_w', 300 ); // don't depend on these
		update_option( 'medium_size_h', 300 ); // the size of these can be edited by the user
		update_option( 'medium_large_size_w', 768 );
		update_option( 'medium_large_size_h', 768 );
		update_option( 'large_size_w', 1024 ); // don't depend on these
		update_option( 'large_size_h', 1024 ); // the size of these can be edited by the user
		add_image_size( 'extralarge', 1600 );
		// more image sizes is good for page speed now that srcset is in wp core:
		// make.wordpress.org/core/2015/11/10/responsive-images-in-wordpress-4-4/

		// change option defaults - https://codex.wordpress.org/Option_Reference
		update_option('image_default_link_type', 'none');
		update_option('image_default_align', 'none');
		update_option('uploads_use_yearmonth_folders', 0); // keep all uploaded images in the same folder
		update_option('use_smilies', 0); // becasue fuck smiling >:(

	}
	add_action( 'after_setup_theme', 'wpajax_theme_setup' );


	// Widgets
	function wpajax_widget_setup() {
		register_sidebar( array(
			'name'          => __( 'Sidebar Widgets', 'wpajax' ),
			'id'            => 'sidebar-primary',
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		) );
	}
	add_action( 'widgets_init', 'wpajax_widget_setup' );


	// add custom css to style inside the tinyMCE editor
	function add_editor_styles() {
		add_editor_style(); // path defaults to editor-style.css
	}
	add_action( 'admin_init', 'add_editor_styles' );


	if ( ! isset( $content_width ) ) { // this guy sucks - https://codex.wordpress.org/Content_Width
		$content_width = 2000;
	}


	function load_theme_scripts_and_styles() {
		global $post;
		$themeVersion = wp_get_theme()->get( 'Version' );

		// Load Custom Styles
		wp_register_style( 'style', get_stylesheet_uri(), false, $themeVersion);
		wp_enqueue_style( 'style' );
		// Remove widget css from head - https://wordpress.org/support/topic/remove-css-from-head

		// Load jQuery scripts - jq v1.12.0 is for < IE8
		wp_dequeue_script( 'jquery' ); // if using vanilla .js
		// google Hosted jQuery
		// wp_register_script( 'jquery', "http://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js", false, null, false, true);
		// wp_enqueue_script( 'jquery' );

		// add the wp comment-reply.js to manage comments
		if ( is_singular() && comments_open() && get_option( 'thread_comments' ) )
			wp_enqueue_script( 'comment-reply' );

		if ($GLOBALS['isDev'])
			wp_enqueue_script( 'livereload', '//localhost:35729/livereload.js', false, $themeVersion, true );

		// Load Custom Scripts
		wp_register_script( 'wpajaxjs', get_template_directory_uri()."/_/js/wpajax.js", false, $themeVersion, true );
		// wp_enqueue_script( 'wpajaxjs' );

		wp_register_script( 'production', get_template_directory_uri()."/_/js/build/production.js", false, $themeVersion, true );
		wp_enqueue_script( 'production' );

	}
	add_action( 'wp_enqueue_scripts', 'load_theme_scripts_and_styles' );


	// DISABLE EMOJIs  -  http://wordpress.stackexchange.com/questions/185577/disable-emojicons-introduced-with-wp-4-2
	function disable_wp_emojicons() {
		// all actions related to emojis
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
		// filter to remove TinyMCE emojis
		function disable_emojicons_tinymce( $plugins ) {
			if ( is_array( $plugins ) ) {
				return array_diff( $plugins, array( 'wpemoji' ) );
			} else {
				return array();
			}
		}
		add_filter( 'tiny_mce_plugins', 'disable_emojicons_tinymce' );
	}
	add_action( 'init', 'disable_wp_emojicons' );


?>
