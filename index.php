<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
 get_header(); ?>

	<?php if (have_posts()) : ?>

		<section class="postList">		
			<?php while (have_posts()) : the_post(); ?>

				<?php template_post_item(); ?>

			<?php endwhile; ?>
		</section>

		<?php wpajax_post_pagination(); ?>

	<?php else : ?>

		<h1><?php _e('Nothing Found','wpajax'); ?></h1>

	<?php endif; ?>

<?php get_footer(); ?>
