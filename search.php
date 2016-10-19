<?php
/**
 * @package      WordPress
 * @subpackage   wpajax
 * @since        0.1.0
 */
?>

<?php get_header(); ?>

<?php wpajax_postList('search'); ?>

<?php wpajax_postItem('empty'); ?>

<?php get_footer(); ?>
