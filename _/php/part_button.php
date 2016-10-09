<?php
/**
 *
 * Template Part
 * button with progress element built in
 *
 * @package     WordPress
 * @subpackage  wpajax
 * @since       0.1.0
**/



function wpajax_button( $atts, $content=null ) {
	extract( shortcode_atts( array( // extract turns the array['vars'] into individual $vars
		'class' => '',
		'style' => '',
	), $atts , 'divider' ));

	$classList    = $class != '' ? ' class="'.$class.'" ' : '' ;
	$inlineStyles = $style != '' ? ' style="'.$style.'" ' : '' ;

	$div  = '<div '.$classList.$inlineStyles.'>';
	$div .= do_shortcode($content);
	$div .= '</div>';

	?>
	<a class="button">

		<?php echo do_shortcode( $content ); ?>

	</a>
	<?php

	return $div;
}
// add_shortcode( 'wpajax_button', 'wpajax_button' );

?>
