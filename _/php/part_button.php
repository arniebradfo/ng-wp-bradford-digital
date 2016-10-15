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
		'id' => '',
		'class' => '',
		'style' => '',
		'href' => '',
		'text' => 'link',
	), $atts ));

	$id = $id != '' ? ' id="'.$id.'" ' : '' ;
	$style = $style != '' ? ' style="'.$style.'" ' : '' ;
	$href = $href != '' ? ' href="'.$href.'" ' : '' ;

	ob_start(); ?>
	<a class="button <?php echo $class; ?>" <?php echo $style; echo $href; echo $id; ?> >

		<div class="button__loadbar"></div>

		<span class="button__text"><?php echo $text; ?></span>

		<?php echo do_shortcode( $content ); ?>

	</a>
	<?php return ob_get_clean();
}
// add_shortcode( 'wpajax_button', 'wpajax_button' );

?>
