$(document).ready(function(){

	$('.site-hero').on('mouseenter', function(){
		$('.site-hero__preview').addClass('site-hero__preview--expanded');
		$('.site-hero__preview').children().css('visibility', 'visible');
	});

	$('.site-hero').on('mouseleave', function(){
		$('.site-hero__preview').removeClass('site-hero__preview--expanded');
		$('.site-hero__preview').children().css('visibility', 'hidden');
	});

});