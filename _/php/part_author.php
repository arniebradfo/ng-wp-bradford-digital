<?php
/**
 *
 * Template Part
 * author meta field
 *
 * @package     WordPress
 * @subpackage  wpajax
 * @since       0.1.0
**/

// Posted On
function wpajax_the_author($type = 'info') {

	if ($type == 'info'): ?>

	<div class="authorInfo">
		<a class="authorInfo__avatar" href="<?php echo get_author_posts_url(get_the_author_meta('ID')); ?>">
			<?php echo get_avatar(
				get_the_author_meta('ID'),
				32,
				'retro',
				'author gravatar profile image',
				array( 'class' => 'authorInfo__avatarImg' )
			); ?>
		</a>
		<div class="authorInfo__text" >
			<span class="authorInfo__by" >
				By:
				<a class="authorInfo__byLink" >
					<?php echo esc_attr( get_the_author() ); ?>
				</a>
			</span>
			 <br/>
			<a class="authorInfo__dateLink" >
				<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>" pubdate>
					<?php echo esc_html( get_the_date() ); ?>
				</time>
			</a>
		</div>
	</div>

	<?php elseif ($type == 'bio') : ?>

		<section class="authorBio">
			<a class="authorInfo__avatar" href="<?php echo get_author_posts_url(get_the_author_meta('ID')); ?>">
				<?php echo get_avatar(
					get_the_author_meta('ID'),
					32,
					'retro',
					'author gravatar profile image',
					array( 'class' => '' )
				); ?>
			</a>
			<h2><?php echo esc_attr( get_the_author() ); ?></h2>
			<p><?php the_author_meta('description'); ?></p>
		</section>

	<? endif;
}

?>
