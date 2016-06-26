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

			<article <?php post_class() ?> id="post-<?php the_ID(); ?>">

				<section class="cover">

					<?php echo the_post_thumbnail('full', array(
						'class' => 'cover__hero'
					)); ?>

					<h1 class="cover__title"><?php the_title(); ?></h1>

				</section>

				<section class="entry">

					<?php the_content(); ?>

					<?php wp_link_pages(array('before' => __('Pages: ','wpajax'), 'next_or_number' => 'number')); ?>

					<?php the_tags( __('Tags: ','wpajax'), ', ', ''); ?>

					<?php posted_on(); ?>

				</section>

				<?php edit_post_link(__('Edit this entry','wpajax'),'','.'); ?>

				<?php comments_template(); ?>

			</article>

			*/
		?>

		<?php template_post_item(); ?>

	<?php endwhile; endif; ?>

<?php get_footer(); ?>
