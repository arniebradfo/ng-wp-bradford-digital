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
function wpajax_postList ($type = null) {
	global $wp_query;

	$_query;
	if ($type == 'aside') {
		$_query = new WP_Query(array('post_type'=>'post'));
	} else {
		$_query = $wp_query;
	}

	?>

	<aside class="postListWrapper">

		<?php // if the "Posts Page" has content in it // set "Front Page" to "-- Select --"
		$page_for_posts_id = false;
		if ('page' == get_option('show_on_front') && get_option('page_for_posts') && is_home() && $type == 'index') :
			the_post();
			$page_for_posts_id = get_option('page_for_posts');
			setup_postdata(get_page($page_for_posts_id));
			?>

			<section class="blogPageContent" id="post-<?php the_ID(); ?>">
				<?php the_content(); ?>
			</section>

			<?php
			rewind_posts();
		endif; ?>

		<?php if ($type == 'author') : ?>
			<?php wpajax_the_author('bio') ?>
		<?php else : ?>

			<h1><?php
				if (!$_query->have_posts()) _e('Nothing Found','wpajax');
				elseif ($page_for_posts_id) echo get_the_title($page_for_posts_id); // if "Posts Page" is set, but not "Front Page"
				elseif (is_home() && !is_front_page()) single_post_title();
				elseif (is_archive()) the_archive_title();
				elseif (is_search()) echo 'search results for: '. get_search_query();
				else echo 'Latest Posts';
				if (is_paged()) echo ' <span>Page '.get_query_var('paged').'</span>';
			?></h1>

			<?php get_search_form(); ?>

			<p><?php
				if (!$_query->have_posts()) echo 'sorry :(';
				elseif (get_the_author_meta('description') && is_author()) the_author_meta( 'description' );
				elseif (the_archive_description() && is_archive()) the_archive_description();
			?></p>

		<?php endif; ?>


		<?php if ($_query->have_posts()) : ?>

			<section class="postList postList--full">
				<?php while ($_query->have_posts()) : $_query->the_post(); ?>

					<?php wpajax_postItem('list'); ?>

				<?php endwhile; ?>
			</section>

			<?php wpajax_post_pagination(); ?>

			<?php if (isset($type)) wp_reset_postdata(); ?>

		<?php endif; ?>

	</aside>

	<main class="mainContent mainContent--active"><!-- closed in footer.php -->

	<?php

}

?>
