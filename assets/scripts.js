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
					pages.push('<li class="pager page"><a href="?page=' + k + '" class="hover-page">' + k + '</a></li>');
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
	var pages = $('.pager-collection').children().length;

	$('.page-prev').on('click', function(e){
		e.preventDefault();

		if(!toggleNextPrev(this, 'prev', pages))
			return;

		if(!$('.page-next').hasClass('hover-page')) { $('.page-next').addClass('hover-page'); }
	});

	$('.page-next').on('click', function(e){
		e.preventDefault();

		if(!toggleNextPrev(this, 'next', pages))
			return;

		if(!$('.page-prev').hasClass('hover-page')) { $('.page-prev').addClass('hover-page'); }
	});

	$('.page').on('click', function(e){
		e.preventDefault();

		var page = parseInt($(this).text());
		var onpage = parseInt($('.page-active').text());

		//animation direction depends on if desination page is before or after the current page
		if(page > onpage) {
			//swipes left
			for(var i = onpage; i < page; i++){
				$('.container-page-' + i).addClass('prev gallery-table__container--hidden').removeClass('gallery-table__container--active');
				$('.container-page-' + i).next().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden next');
			}
		} else if(page < onpage) {
			//swipes right
			for(var k = onpage; k > page; k--){
				$('.container-page-' + k).addClass('next gallery-table__container--hidden').removeClass('gallery-table__container--active');
				$('.container-page-' + k).prev().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden prev');
			}
		}

		//set new active class to clicked page
		$('.page-active').removeClass('page-active');
		$(this).find('a').addClass('page-active');

		if(!$('.gallery-table__container--active').next().length) {
			$('.page-next').removeClass('hover-page');
			$('.page-prev').addClass('hover-page');
		}
		else if(!$('.gallery-table__container--active').prev().length) {
			$('.page-prev').removeClass('hover-page');
			$('.page-next').addClass('hover-page');
		}
		else {
			$('.page-prev, .page-next').addClass('hover-page');
		}
	});
}

function toggleNextPrev(btn, direction, pages) {
	var active = $('.page-active');
	var current = $('.gallery-table__container--active');

	//cant go forward or back anymore
	if((!current.prev().length && direction === 'prev') || (!current.next().length && direction === 'next'))
		return false;

	//increment or decrement depending on direction
	if(direction === 'prev') {
		current.addClass('next gallery-table__container--hidden').removeClass('gallery-table__container--active');
		current.prev().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden prev');
		active.parent().prev().children().addClass('page-active');
	}
	else {
		current.addClass('prev gallery-table__container--hidden').removeClass('gallery-table__container--active');
		current.next().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden next');
		active.parent().next().children().addClass('page-active');
	}
	current = $('.gallery-table__container--active');	//update current (visible) container
	active.removeClass('page-active');

	//pagination next prev styling
	//remove hoverable state if no more pages in either direction
	if(current.attr('class').includes('container-page-1') || current.attr('class').includes('container-page-' + pages))
		$(btn).removeClass('hover-page');
	else if(!$(btn).hasClass('hover-page'))
		$(btn).addClass('hover-page');

	return true;
}