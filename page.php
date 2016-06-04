<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
 get_header(); ?>

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>

		<?php switch ( get_post_format() ): // output different HTML based on the post type
		             case 'aside': ?>
		<?php break; case 'chat': ?>
		<?php break; case 'gallery': ?>
		<?php break; case 'link': ?>
		<?php break; case 'image': ?>
		<?php break; case 'quote': ?>
		<?php break; case 'status': ?>
		<?php break; case 'video': ?>
		<?php break; case 'audio': ?>
		<?php break; default: // marked 'standard'?>
		<?php endswitch;?>
			
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

		<?php endwhile; endif; ?>

<?php get_footer(); ?>
