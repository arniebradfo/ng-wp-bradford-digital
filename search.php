<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
 get_header(); ?>

	<?php if (have_posts()) : ?>

		<h1><?php _e('Search Results','wpajax'); ?></h1>

		<section class="post-items">		
			<?php while (have_posts()) : the_post(); ?>

				<?php wpajax_postItem(); ?>

			<?php endwhile; ?>
		</section>

	<?php else : ?>

		<h1><?php _e('Nothing Found','wpajax'); ?></h1>

	<?php endif; ?>

<?php get_footer(); ?>
