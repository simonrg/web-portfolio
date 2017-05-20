var page = $(location).attr('pathname').replace(/\//g, '');

if(page === '' || page === 'web-portfolio') { page = 'home'; }
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
			var perpage = 6;
			var container = 1;

			//get uploaded images
			for(var i = 0; i < data.resources.length; i++) {
				var path = data.resources[i].public_id + '.' + data.resources[i].format;

				if((i % perpage === 0) && (i !== 0))
					images.push('</div>');

				if(i % perpage === 0) {
					
					if(i === 0)
						images.push('<div class="gallery-table__container container-page-' + container + ' gallery-table__container--active">');
					else
						images.push('<div class="gallery-table__container container-page-' + container + ' gallery-table__container--hidden next">');

					container++;
				}

				images.push('<div class="col span_1_of_3"><a data-fancybox="gallery" href="https://res.cloudinary.com/dvzk8xiff/image/upload/' + 
					path + '"><img src="https://res.cloudinary.com/dvzk8xiff/image/upload/' + path + '" class="gallery__image" width="370px" alt="image cell"></a></div>');

			}
			images.push('</div>');

			$('.gallery-table').append(images.join(''));


			//calculate number of pagers to cycle through gallery
			if(data.resources.length >= perpage) {
				var total = data.resources.length;
				var pager = total / perpage;

				for(var k = 2; k < Math.ceil(pager)+1; k++) {
					pages.push('<li class="pager page"><a href="?page=' + k + '">' + k + '</a></li>');
				}

				$('.pager-collection').append(pages);
			}

			pagerNav();
		},
		error: function() {
			console.log('The requested resources could not be loaded.');
		}
	});
}

function pagerNav() {
	var current = $('.gallery-table__container--active').attr('class').split(' ')[1];

	//listeners for button events
	$('.page-prev').on('click', function(e){
		e.preventDefault();
		var active = $('.page-active');

		if(!$('.gallery-table__container--active').prev().length)
			return;
		
		//current element becomes next, next element becomes current
		$('.' + current).addClass('next gallery-table__container--hidden').removeClass('gallery-table__container--active');
		$('.' + current).prev().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden prev');

		current = $('.gallery-table__container--active').attr('class').split(' ')[1];

		//decrement active page style
		$('.page-active').parent().prev().children().addClass('page-active');
		active.removeClass('page-active');
	});

	$('.page-next').on('click', function(e){
		e.preventDefault();
		var active = $('.page-active');

		if(!$('.gallery-table__container--active').next().length)
			return;

		//current element becomes previous, next element becomes current
		$('.' + current).addClass('prev gallery-table__container--hidden').removeClass('gallery-table__container--active');
		$('.' + current).next().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden next');

		current = $('.gallery-table__container--active').attr('class').split(' ')[1];

		//increment active page style
		$('.page-active').parent().next().children().addClass('page-active');
		active.removeClass('page-active');
	});

	$('.page').on('click', function(e){
		e.preventDefault();

		var page = parseInt($(this).text());
		var onpage = parseInt(current.substring(current.lastIndexOf('-') + 1));

		//animation direction depends on if desination page is before or after the current page
		if(page > onpage) {
			//swipes left
			for(var i = onpage; i < page; i++){
				$('.container-page-' + i).addClass('prev gallery-table__container--hidden').removeClass('gallery-table__container--active');
				$('.container-page-' + i).next().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden next');
			}
			current = $('.gallery-table__container--active').attr('class').split(' ')[1];
		} else if(page < onpage) {
			//swipes right
			for(var k = onpage; k > page; k--){
				$('.container-page-' + k).addClass('next gallery-table__container--hidden').removeClass('gallery-table__container--active');
				$('.container-page-' + k).prev().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden prev');
			}
			current = $('.gallery-table__container--active').attr('class').split(' ')[1];
		}

		//set new active class to clicked page
		$('.page-active').removeClass('page-active');
		$(this).find('a').addClass('page-active');
	});
}