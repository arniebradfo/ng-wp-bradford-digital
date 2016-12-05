<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
?>

<?php

	$GLOBALS['is_ajax'] = get_query_var('ajax') ? true : false ;
	if ($GLOBALS['is_ajax']) {
		// detect differet types of wordpress ajax requests by setting a header in the js call
		$GLOBALS['is_ajax_post_comment'] = strtolower(get_query_var('ajax')) == 'postcomment';
		$GLOBALS['is_ajax_get_page']     = strtolower(get_query_var('ajax')) == 'getpage';
		$GLOBALS['is_ajax_get_posts']    = strtolower(get_query_var('ajax')) == 'getposts';
		$GLOBALS['is_ajax_get_comments'] = strtolower(get_query_var('ajax')) == 'getcomments';
	} else {
		// set every false
		$GLOBALS['is_ajax_post_comment'] =
		$GLOBALS['is_ajax_get_page'] =
		$GLOBALS['is_ajax_get_posts'] =
		$GLOBALS['is_ajax_get_comments'] = false;
	}

	// if this is an ajax request paganating comments
	if ($GLOBALS['is_ajax'] && $GLOBALS['is_ajax_get_comments']){
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

				wpajax_postItem();

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

<?php else: // step out of ajax detection for the head ?>

<div id="ajax-head">

<?php endif; ?>

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

<body <?php body_class(['body--mainNavClosed']); ?> >

	<a 
		id="mainNav__toggle" 
		class="mainNav__toggle" 
		href="#navOpen" 
		data-navforward="navigationJS_mainNavToggle" 
		data-navback="navigationJS_mainNavToggle" 
		data-routersetstate="navigationJS_mainNavSet"
		>
		nav
	</a>

	<header id="mainNav" class="mainNav nav" role="navigation">
		<a class="mainNav__logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php bloginfo( 'name' ); ?>
		</a>
		<div class="mainNav__description">
			<?php bloginfo( 'description' ); ?>
		</div>
		<?php
		$classPlacement = has_nav_menu( 'primary' ) ? 'container_class' : 'menu_class' ;
		wp_nav_menu( array(
			'theme_location' => 'primary',
			$classPlacement => 'mainNav__menu',
			'container' => 'nav'
		) );
		?>
	</header>

<?php endif; // end ajax detection ?>
