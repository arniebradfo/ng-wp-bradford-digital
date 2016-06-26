<?php
/**
 *
 * postItem
 *
 * @package WordPress
 * @subpackage wpajax
 * @since 0.1.0
**/

// HTML for a post links - use inside the loop
function template_post_item() {
	?>
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
	<article <?php post_class('postItem'); ?> id="post-<?php the_ID(); ?>">

		<h2 class="postItem__title">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h2>

		<?php posted_on(); ?>

		<figure class="postItem__hero">
			<div class="postItem__heroTranslate">
				<div class="postItem__heroWrapper">
					<?php the_post_thumbnail('medium', array(
						'class' => 'postItem__heroImg postItem__heroImg--blur'
					) ); ?>
					<?php the_post_thumbnail('medium', array(
						'class' => 'postItem__heroImg postItem__heroImg--focus'
					) ); ?>
				</div>
			</div>
		</figure>

		<div class="excerpt">
			<?php the_excerpt(); ?>
		</div>

		<footer class="postmetadata">
			<?php the_tags(__('Tags: ','wpajax'), ', ', '<br />'); ?>
			<?php _e('Posted in','wpajax'); ?>
			<?php the_category(', '); ?> |
			<?php comments_popup_link(__('No Comments &#187;','wpajax'), __('1 Comment &#187;','wpajax'), __('% Comments &#187;','wpajax')); ?>
		</footer>

	</article>
	<?php
}

?>
