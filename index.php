<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
 get_header(); ?>

	<?php if (have_posts()) : ?>

		<section class="postList postList--full">
			<?php while (have_posts()) : the_post(); ?>

				<?php wpajax_postItem(); ?>

			<?php endwhile; ?>
		</section>

		<?php wpajax_post_pagination(); ?>

	<?php endif; ?>

<?php get_footer(); ?>
