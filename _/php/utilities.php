<?php
/**
 *
 * utility functions
 * 
 * @package WordPress
 * @subpackage wpajax
 * @since 0.1.0
 */

// source: https://css-tricks.com/snippets/php/get-current-page-url/
function get_the_url() {
	$url  = @( $_SERVER["HTTPS"] != 'on' ) ? 'http://'.$_SERVER["SERVER_NAME"] :  'https://'.$_SERVER["SERVER_NAME"];
	$url .= ( $_SERVER["SERVER_PORT"] !== 80 ) ? ":".$_SERVER["SERVER_PORT"] : "";
	$url .= $_SERVER["REQUEST_URI"];
	return $url;
}

?>