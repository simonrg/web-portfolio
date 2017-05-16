var page = $(location).attr('pathname').replace(/\//g, '');

if(page === '') { page = 'home'; }
if(page.includes('draft')) { cloudinaryAPI(); }



$(document).ready(function(){

	if(navigator.userAgent.indexOf("Mobile") > -1)
		toggleMobileMenu();

	if(page.includes('home'))
		homepageBanner();

	formValidation();

	footerYear();
});



function toggleMobileMenu() {
	var menu = $('.mobile-menu__item');

	for(var i = 0; i < menu.length; i++) {
		if($.trim(menu[i].innerText) == $.trim(page.toUpperCase())) {	//all pages
			$('.mobile-menu__item:eq(' + i + ')').addClass('active');
			continue;
		}
		else if(page === 'home') {
			$('.mobile-menu__item:eq(0)').addClass('active');
			continue;
		}
	}

	$('.nav-trigger').on('click', function(){
		if($('.mobile-menu').hasClass('menu-open'))
			$('.mobile-menu').removeClass('menu-open');
		else 
			$('.mobile-menu').addClass('menu-open');
	});
}

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
		url: 'https://res.cloudinary.com/dvzk8xiff/image/list/sketch.json',
		crossDomain: true,
		success: function(data) {
			var images = [];
			var pages = [];
			var perpage = 9;

			//get uploaded images
			for(var i = 0; i < data.resources.length; i++) {
				var path = data.resources[i].public_id + '.' + data.resources[i].format;

				images.push('<div class="col span_1_of_3"><a data-fancybox="gallery" href="https://res.cloudinary.com/dvzk8xiff/image/upload/' + 
					path + '"><img src="https://res.cloudinary.com/dvzk8xiff/image/upload/' + path + '" class="gallery__image" width="370px" alt="image cell"></a></div>');
			}

			//calculate number of pagers to cycle through gallery
			if(data.resources.length >= perpage) {
				var total = data.resources.length;
				var pager = total / perpage;

				for(var k = 2; k < Math.ceil(pager)+1; k++) {
					pages.push('<li class="pager"><a href="?page=' + k + '">' + k + '</a></li>');
				}

				$('.pager-collection').append(pages);
			}
			
			$('.gallery-table').append(images);
		},
		error: function() {
			console.log('The requested resources could not be loaded.');
		}
	});
}