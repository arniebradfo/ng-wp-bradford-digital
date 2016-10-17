<?php
/**
 *
 * Template Part
 * postItem
 *
 * @package WordPress
 * @subpackage wpajax
 * @since 0.1.0
**/

// HTML for a post links - use inside the loop
function wpajax_postList ($type = null) {
	global $wp_query;

	$_query;
	if ($type == 'aside') {
		$_query = new WP_Query(array('post_type'=>'post'));
	} else {
		$_query = $wp_query;
	}

	if ($_query->have_posts()) : ?>


		<!-- <h1><?php echo the_archive_title(); ?></h1>
		<?php if (the_archive_description()): ?>
			<p><?php echo the_archive_description(); ?></p>
		<?php endif; ?> -->

		<!-- <h1><?php _e('Search Results','wpajax'); ?></h1> -->

		<?php if ( is_home() && ! is_front_page() ) : ?>
			<h1 class="page-title"><?php single_post_title(); ?></h1>
		<?php endif; ?>
		<?php get_search_form(); ?>

		<section class="postList postList--full">
			<?php while ($_query->have_posts()) : $_query->the_post(); ?>

				<?php wpajax_postItem('list'); ?>

			<?php endwhile; ?>
		</section>

		<?php wpajax_post_pagination(); ?>

		<?php if (isset($type)) wp_reset_postdata(); ?>
	<?php else : ?>

		<h1><?php _e('Nothing Found','wpajax'); ?></h1>

	<?php endif;
}

?>
