<?php
/**
 *
 * WordPress Shortcodes
 * codex.wordpress.org/Shortcode_API
 *
 * @package WordPress
 * @subpackage wpajax
 * @since 0.1.0
 */

// [divider class="divider" style="property:value;" ]<p>raw HTML content</p>[/divider]
function divider_func( $atts, $content=null ) {
	extract( shortcode_atts( array( // extract turns the array['vars'] into individual $vars
		'class' => '',
		'style' => '',
	), $atts , 'divider' ));

	$classList    = $class != '' ? ' class="'.$class.'" ' : '' ;
	$inlineStyles = $style != '' ? ' style="'.$style.'" ' : '' ;

	$div  = '<div '.$classList.$inlineStyles.'>';
	$div .= do_shortcode($content);
	$div .= '</div>';

	return $div;
}
add_shortcode( 'divider', 'divider_func' );

?>
