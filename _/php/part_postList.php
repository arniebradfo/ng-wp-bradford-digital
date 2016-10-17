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

		<h1><?php
			if (is_home() && !is_front_page()) single_post_title();
			if (is_archive()) the_archive_title();
			if (is_search()) echo 'search results for: '. get_search_query();
		?></h1>

		<p><?php
			if (get_the_author_meta( 'description' ) && is_author()) the_author_meta( 'description' );
			if (the_archive_description() && is_archive()) the_archive_description();
		?></p>

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
