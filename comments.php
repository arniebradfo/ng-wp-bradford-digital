<?php

	if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
		die ('Please do not load this page directly. Thanks!');

	if ( post_password_required() ) { ?>
		<?php _e('This post is password protected. Enter the password to view comments.','wpajax'); ?>
	<?php
		return;
	}
?>

<section id="comments-section">

<?php if ( have_comments() ) : ?>
	
	<h2 id="comments"><?php comments_number(__('No Responses','wpajax'), __('One Response','wpajax'), __('% Responses','wpajax') );?></h2>

	<?php wpajax_comment_pagination(); ?>

	<ol class="commentlist">
		<?php wp_list_comments(); ?>
	</ol>

	<?php wpajax_comment_pagination(true); ?>
	
 <?php else : // this is displayed if there are no comments so far ?>

	<?php if ( comments_open() ) : ?>
		<!-- If comments are open, but there are no comments. -->
		<nav class="nav comment-navigation"></nav>
		<ol class="commentlist"></ol>
		<nav class="nav comment-navigation"></nav>

	 <?php else : // comments are closed ?>
		<p><?php _e('Comments are closed.','wpajax'); ?></p>

	<?php endif; ?>
	
<?php endif; ?>

<?php if ( comments_open() ) : ?>

	<?php comment_form(); ?>
	

</section>

<?php endif; ?>
