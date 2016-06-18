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

	<input id="mainNav--opener" type="checkbox" />

	<header class="header">
		<nav class="mainNav nav" role="navigation">
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
			) );
			?>
		</nav>
		<section class="postList postList--header">
		<?php $q = new WP_Query(array('post_type'=>'post')); ?>
		<?php if ($q->have_posts()): ?>
				<?php while ($q->have_posts()) : $q->the_post(); ?>

					<?php template_post_item(); ?>

				<?php endwhile; ?>
		<?php else: ?>
			<h1><?php _e('Nothing Found','wpajax'); ?></h1>
		<?php endif; wp_reset_postdata(); ?>
		</section>
	</header>

	<div class="mainWrapper">

	<?php endif; // end ajax detection ?>

		<main class="main"><?php // Pjax content wrapper element ?>
