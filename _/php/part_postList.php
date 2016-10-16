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
function wpajax_postList () {
	?>

	<?php if ( is_home() && ! is_front_page() ) : ?>
		<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
	<?php endif; ?>
	<?php get_search_form(); ?>

	<!-- <h1><?php echo the_archive_title(); ?></h1>
	<?php if (the_archive_description()): ?>
		<p><?php echo the_archive_description(); ?></p>
	<?php endif; ?> -->

	<!-- <h1><?php _e('Search Results','wpajax'); ?></h1> -->

	<?php if (have_posts()) : ?>

		<?php if ( is_home() && ! is_front_page() ) : ?>
			<h1 class="page-title"><?php single_post_title(); ?></h1>
		<?php endif; ?>
		<?php get_search_form(); ?>

		<section class="postList postList--full">
			<?php while (have_posts()) : the_post(); ?>

				<?php wpajax_postItem(); ?>

			<?php endwhile; ?>
		</section>

		<?php wpajax_post_pagination(); ?>

	<?php else : ?>

		<h1><?php _e('Nothing Found','wpajax'); ?></h1>

	<?php endif; ?>

	<?php
}

?>
