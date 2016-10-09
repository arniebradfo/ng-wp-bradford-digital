<?php
/**
 *
 * custom html outputs
 *
 * @package WordPress
 * @subpackage wpajax
 * @since 0.1.0
**/

// encodes the attributes of tag as data-attributes in a target tag
function encode_data_atts ($targetTag, $dataTag) {
	$dataAtts = preg_replace(
		'/(<[^\s\/>]+)/i',
		'',
		$dataTag
	);
	$dataAtts = preg_replace(
		'/(\/?>)/i',
		'',
		$dataAtts
	);
	$dataAtts = preg_replace(
		'/(\s)([^<>=\s]+)(=\"[^\"]*")?/i',
		'$1data-$2$3',
		$dataAtts
	);
	$targetTag = preg_replace(
		'/(\/?>)/i',
		$dataAtts.' $1',
		$targetTag
	);
	return $targetTag;
}


?>
