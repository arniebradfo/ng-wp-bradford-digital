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

			<h2 class="cover__title">
				<a class="cover__titleLink" href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h2>

			<?php // posted_on(); ?>

			<figure class="cover__hero">
				<a class="cover__heroWrapper" href="<?php the_permalink(); ?>" >
					<?php if ($type === 'single' || $type === 'page')
						the_post_thumbnail('full', array( 'class' => 'cover__heroImg cover__heroImg--full' ) ); ?>
					<?php if ($type === 'list')
						the_post_thumbnail('medium', array( 'class' => 'cover__heroImg cover__heroImg--blur' ) ); ?>
					<?php if ($type === 'list')
						the_post_thumbnail('medium', array( 'class' => 'cover__heroImg cover__heroImg--list' ) ); ?>
				</a>
			</figure>

		</header>

		<section class="excerpt">
			<?php if ($type === 'list') the_excerpt(); ?>
		</section>

		<section class="content">
			<?php if ($type === 'single' || $type === 'page') the_content(); ?>
		</section>

		<section class="comments">
			<?php if ($type === 'single' || $type === 'page') comments_template(); ?>
		</section>

		<!-- <footer class="postmetadata">
			<?php the_tags(__('Tags: ','wpajax'), ', ', '<br />'); ?>
			<?php _e('Posted in','wpajax'); ?>
			<?php the_category(', '); ?> |
			<?php comments_popup_link(__('No Comments &#187;','wpajax'), __('1 Comment &#187;','wpajax'), __('% Comments &#187;','wpajax')); ?>
		</footer> -->

	</article>
	<?php
}

?>
