<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
?>

<?php
	// if this is an ajax request paganating comments
	if ($GLOBALS['is_ajax'] && $GLOBALS['is_ajax_get_comments_section']){
		// return only the comments section of the current context
		if (have_posts()) : while (have_posts()) : the_post();

			comments_template();

		endwhile; endif;
		exit;
	}

	// if this is an ajax request paganating posts
	if ($GLOBALS['is_ajax'] && $GLOBALS['is_ajax_get_posts']){
		// return only the comments section of the current context
		if (have_posts()) : ?>
			<section class="post-items">
			<?php while (have_posts()) : the_post();

				template_post_item();

			endwhile; ?>
			</section>
		<?php
		wpajax_post_pagination();
		endif;
		exit;
	}
?>

<?php if (!$GLOBALS['is_ajax']): // if this is not an ajax call ?>

<!DOCTYPE html>

<!--[if lt IE 9 ]> <html class="ie ie-lt11 ie-lt10 ie-lt9" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 9 ]>    <html class="ie ie9 ie-lt11 ie-lt10" <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 10 ]>   <html class="ie ie10 ie-lt11 " <?php language_attributes(); ?>> <![endif]-->
<!--[if IE 11 ]>   <html class="ie ie11 " <?php language_attributes(); ?>> <![endif]-->
<!--[if !IE ]><!--><html <?php language_attributes(); ?>><!--<![endif]-->

<head>

<?php endif; // step out of ajax detection for the head ?>

<?php if ($GLOBALS['is_ajax']){ ?><div id="ajax-head"><?php } // wrap meta info ?>

	<?php // <!-- Application-specific meta tags -->
		// Google  				-  https://support.google.com/webmasters/answer/79812
		// LinkedIn  			-  https://developer.linkedin.com/docs/share-on-linkedin
		// OpenGraph  			-  http://ogp.me/
		// Richard's Toolbox  	-  http://richardstoolbox.com/#q=meta tag
		// Windows  			-  https://msdn.microsoft.com/en-us/library/dn255024(v=vs.85).aspx
		// 						-  https://msdn.microsoft.com/library/dn455106.aspx
		// Twitter  			-  https://dev.twitter.com/cards/markup
		// Facebook  			-  https://developers.facebook.com/docs/sharing/webmasters
	?>
	<meta charset="<?php bloginfo('charset'); ?>"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0 minimal-ui" />
	<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
	<?php author_meta_tag(); ?>

	<!-- wp_head starts here -->
	<?php wp_head(); ?>

<?php if ($GLOBALS['is_ajax']): ?>

	</div><!-- #ajax-head -->

	<nav id="wp-all-registered-nav-menus">
		<?php
			$menus = get_registered_nav_menus();
			foreach ( $menus as $location => $description ) {
				wp_nav_menu( array('theme_location' => $location) );
			}
		?>
	</nav>

<?php else:	// non-ajax ?>

</head>

<body <?php body_class(); ?> >

	<header id="header" role="banner">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
		<div class="description"><?php bloginfo( 'description' ); ?></div>
		<nav class="nav" role="navigation">
			<?php wp_nav_menu( array('theme_location' => 'primary') ); ?>
		</nav>
	</header>

	<div class="mainWrapper">

	<?php endif; // end ajax detection ?>

		<main id="content"><?php // Pjax content wrapper element ?>
