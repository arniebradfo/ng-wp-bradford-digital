<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
 get_header(); ?>

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

		<?php
			/*
			<article class="post" id="post-<?php the_ID(); ?>">

				<h2><?php the_title(); ?></h2>

				<?php posted_on(); ?>

				<div class="entry">

					<?php the_post_thumbnail(); ?>

					<?php the_content(); ?>

					<?php wp_link_pages(array('before' => __('Pages: ','wpajax'), 'next_or_number' => 'number')); ?>

				</div>

				<?php edit_post_link(__('Edit this entry','wpajax'), '<p>', '</p>'); ?>

			</article>

			<?php comments_template(); ?>
			*/
		?>

		<?php wpajax_postItem(); ?>

		<?php endwhile; endif; ?>

<?php get_footer(); ?>
