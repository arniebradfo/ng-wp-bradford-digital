<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
?>

<?php  get_header(); ?>

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

		<?php wpajax_postItem(); ?>

	<?php endwhile; endif; ?>

<?php get_footer(); ?>
