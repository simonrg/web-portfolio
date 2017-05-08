var page = $(location).attr('pathname');
if(page.includes('draft')) {
	cloudinaryAPI();
}

$(document).ready(function(){
	footerYear();

	homepageBanner();

	formValidation();
});



function footerYear() {
	var d = new Date();
	$('.date').text(d.getFullYear());
}

function homepageBanner() {
	$('.site-hero__button').on('click', function(){
		$(this).addClass('site-hero__button--transition');
		$('.site-hero__preview').addClass('site-hero__preview--expanded');
		setTimeout(function(){ $('.site-hero__preview').children().css('visibility', 'visible'); }, 100);
	});

	$('.site-hero').on('mouseleave', function(){
		$('.site-hero__button').removeClass('site-hero__button--transition');
		$('.site-hero__preview').removeClass('site-hero__preview--expanded');
		setTimeout(function(){ $('.site-hero__preview').children().css('visibility', 'hidden'); }, 100);
	});
}

function formValidation() {
	var name = $('.form-field__item')[0];
	var email = $('.form-field__item')[1];
	var message = $('.form-field__item')[2];

	$('.form-field__item').on('input', function(){
		if(name.value.length > 0 && email.value.length > 0 &&
			message.value.length > 0 && $('.submit-btn').hasClass('submit-btn--disabled')) {
			$('.submit-btn').removeAttr('disabled');
			$('.submit-btn').toggleClass("submit-btn--disabled submit-btn--enabled");
		}

		if($(this).val().length == 0 && $('.submit-btn').hasClass('submit-btn--enabled')) {
			$('.submit-btn').attr('disabled', true);
			$('.submit-btn').toggleClass("submit-btn--enabled submit-btn--disabled");
		}
	});
}

function cloudinaryAPI() {
	$.ajax({
		type: "GET",
		url: 'http://res.cloudinary.com/dvzk8xiff/image/list/sketch.json',
		crossDomain: true,
		success: function(data) {
			for(var i = 0; i < data.resources.length; i++) {
				var path = data.resources[i].public_id + '.' + data.resources[i].format;

				$('.gallery-table').append('<div class="col span_1_of_3"><a data-fancybox="gallery" href="https://res.cloudinary.com/dvzk8xiff/image/upload/v1494158321/' + 
					path + '"><img src="https://res.cloudinary.com/dvzk8xiff/image/upload/v1494158321/' + path + '" class="gallery__image" width="370px" alt="image cell"></a></div>');
			}
		},
		error: function() {
			console.log('The requested resources could not be loaded.');
		}
	});
}