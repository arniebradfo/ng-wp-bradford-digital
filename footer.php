<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
?>

</main>

<?php if (!$GLOBALS['is_ajax']): // if this is not an ajax call ?>

<?php get_sidebar(); ?>

<footer id="footer" class="source-org vcard copyright" role="contentinfo">

	<nav class="nav" role="navigation">
		<?php wp_nav_menu( array('theme_location' => 'secondary') ); ?>
	</nav>
	<small>&copy;<?php echo date("Y"); echo " "; bloginfo('name'); ?></small>

	<div id="wp_footer" style="display:none;">
		<?php wp_footer(); // wrapped in a div so it can be targeted after ajax call if needed ?>
		<?php // all .js is called via the WordPress-friendly way via functions.php ?>
	</div>

</footer>

</body>
</html>
<?php endif;// end ajax detection?>