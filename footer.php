<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
?>


		<?php if (!$GLOBALS['is_ajax']): // if this is not an ajax call ?>

		<footer class="footer">

			<?php get_sidebar(); ?>

			<small>&copy;<?php echo date("Y"); echo " "; bloginfo('name'); ?></small>

			<div id="wp_footer" style="display:none;">
				<?php wp_footer(); // wrapped in a div so it can be targeted after ajax call if needed ?>
			</div>

		</footer>

	</main><!-- .main opened in postList.php -->

</body>

</html>

<?php endif; // end ajax detection?>
