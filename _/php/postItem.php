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
function template_post_item ($type = null) {

	// detect the page type
	if ( !isset($type) ) {
		$type = 'list';
		if ( is_single() ) $type = 'single';
		elseif ( is_page() ) $type = 'page';
	}

	$postItemClasses = array();
	switch ($type) {
		case 'list':
			$postItemClasses[] = 'post--list';
			$postItemClasses[] = 'post--postExpandJS'; // for postExpand.js
			break;
		case 'single':
			$postItemClasses[] = 'post--single';
			$postItemClasses[] = 'post--full';
			break;
		case 'page':
			$postItemClasses[] = 'post--page';
			$postItemClasses[] = 'post--full';
			break;
		default:
			break;
	}

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

	<article <?php post_class($postItemClasses); ?> id="post-<?php the_ID(); ?>">

		<header class="cover">

			<div class="linkBar">
				<?php wpajax_the_author(); ?>
			</div>

			<h2 class="cover__title">
				<a class="cover__titleLink" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h2>

			<figure class="cover__hero">
				<a class="cover__heroWrapper" href="<?php the_permalink(); ?>" >
					<?php
						$full = get_the_post_thumbnail(null, 'full', array( 'class' => 'cover__heroImg cover__heroImg--full' ) );
						$blur = get_the_post_thumbnail(null, 'medium', array( 'class' => 'cover__heroImg cover__heroImg--blur' ) );
						$list = get_the_post_thumbnail(null, 'medium', array( 'class' => 'cover__heroImg cover__heroImg--list' ) );
					?>
					<?php if ($type === 'single' || $type === 'page'): ?>
						<?php echo $full; ?>
					<?php elseif ($type === 'list'): ?>
						<?php echo $blur; ?>
						<?php echo encode_data_atts($list, $full); ?>
					<?php endif; ?>
				</a>
			</figure>

		</header>

		<footer class="info">
			<?php if (get_the_tags()): ?>
			<span class="info__tag info__item">
				<?php the_tags(__('Tagged: ','wpajax'), ', ', ''); ?>
			</span>
			<?php endif; ?>
			<?php if (get_the_category()):?>
			<span class="info__category info__item">
				<?php _e('Category: ','wpajax'); the_category(', '); ?>
			</span>
			<?php endif; ?>
			<span class="info__comment info__item">
				<?php comments_popup_link(__('No Comments','wpajax'), __('1 Comment','wpajax'), __('% Comments','wpajax'), 'commentsLink', __('Comments Off','wpajax')); ?>
			</span>
		</footer>

		<section class="excerpt">
			<?php if ($type === 'list') the_excerpt(); ?>
		</section>

		<section class="frame">
			<?php if ($type === 'single' || $type === 'page'): ?>

			<section class="content">
				<?php the_content(); ?>
			</section>

			<section class="comments">
				<?php comments_template(); ?>
			</section>

			<?php endif; ?>
		</section>


	</article>
	<?php
}

?>
