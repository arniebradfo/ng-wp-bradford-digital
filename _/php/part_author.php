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
function wpajax_the_author() {
	?>
	<div class="authorInfo">
		<a class="authorInfo__avatar">
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
	<?php
}

?>
