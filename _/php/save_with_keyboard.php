<?php
/*
Plugin Name: Save with keyboard
Plugin URI: http://wordpress.org/extend/plugins/save-with-keyboard
Description: This plugin lets you save your posts, pages, theme and plugin files in the most natural way: pressing Ctrl+S (or Cmd+S on Mac).
Author: Mattia Trapani (zupolgec)
Author URI: http://mtrapani.com
Version: 2.1
License: WTFPL (http://sam.zoy.org/wtfpl)
*/

if ( is_admin() && !function_exists('save_with_keyboard_enqueue') ){
	function save_with_keyboard_enqueue() {
		wp_enqueue_script( 'swk_js' , get_template_directory_uri()."/_/php/saveWithKeyboard.js" , array('jquery') );
	}
	add_action('admin_enqueue_scripts','save_with_keyboard_enqueue');
}

?>