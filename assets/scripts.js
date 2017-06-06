var page = $(location).attr('pathname').replace(/\//g, '');

if(page === '' || page === 'web-portfolio') { page = 'home'; }
if(page.includes('draft')) { 
	$('.gallery-table').each(function(i, obj) {
    	cloudinaryAPI(obj.className.split(' ')[0]);
	});
}


$(document).ready(function(){

	if(navigator.userAgent.indexOf("Mobile") > -1)
		toggleMobileMenu();

	if(page.includes('home')) {
		homepageBanner();
        cloudinaryAPI('banner');
	}

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
		$('.mobile-menu').toggleClass('menu-open');
		$('body').toggleClass('mobile-menu-open');
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

function cloudinaryAPI(media) {
	$.ajax({
		type: "GET",
		url: 'https://res.cloudinary.com/dvzk8xiff/image/list/' + media + '.json',
		crossDomain: true,
		success: function(data) {
			var images = [];

			switch(media) {
				case "banner":
					var previews;

					if((navigator.userAgent.indexOf("Mobile") > -1) && ($(window).width() < 600))
						previews = 4;
					else
						previews = 36;

					for(var k = 0; k < previews; k++) {
						if(data.resources[k]) {
							var path = data.resources[k].public_id + '.' + data.resources[k].format;
							images.push('<li class="showcase__item"><div class="image-preview" style="background-image: url(https://res.cloudinary.com/dvzk8xiff/image/upload/' + path + ');"></div></li>');
						}
						else {
							images.push('<li class="showcase__item"><div class="image-preview--none"><i class="fa fa-file-image-o fa-2x" aria-hidden="true"></i></div></li>');
						}
					}

					if($('.site-hero')) { $('.site-hero').append('<ul class="showcase">' + images.join('') + '</ul>'); }

					break;

				case "sketch":
					renderGrid(data, 6, media);

					break;

				case "portrait":
					renderGrid(data, 3, media);

					break;

				default: 
					break;
			}
		},
		error: function() {
			console.log('The requested resources could not be loaded.');
		}
	});
}

function renderGrid(data, perpage, gallery) {
	var images = [];
	var pages = [];
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

	$('.' + gallery).append(images.join(''));


	//calculate number of pages of images in the gallery
	if(data.resources.length > perpage) {
		var total = data.resources.length;
		var pager = total / perpage;

		for(var k = 2; k < Math.ceil(pager)+1; k++) {
			pages.push('<li class="pager page"><a href="?page=' + k + '" class="hover-page">' + k + '</a></li>');
		}

		$('.navigation-pager__' + gallery + ' .pager-collection').append(pages);
		$('.' + gallery + ' + .navigation-pager').css('display', 'block');
		
		pagerNav(gallery);
	}
}

function pagerNav(gallery) {
	//image containers
	var container = '.' + gallery + ' > .container-page-';

	//navigation pages
	var page = $('.navigation-pager__' + gallery + ' .page');
	var next = $('.navigation-pager__' + gallery + ' .page-next');
	var prev = $('.navigation-pager__' + gallery + ' .page-prev');
	var last = parseInt(page.last().text());

	//updates when a new page is clicked
	var current;
	var onpage;
	var topage;

	//event listeners navigation functionality
	prev.on('click', function(e){
		e.preventDefault();

		if(!toggleNextPrev(this, 'prev', last, gallery))
			return;

		if(!next.hasClass('hover-page')) { next.addClass('hover-page'); }
	});

	next.on('click', function(e){
		e.preventDefault();

		if(!toggleNextPrev(this, 'next', last, gallery))
			return;

		if(!prev.hasClass('hover-page')) { prev.addClass('hover-page'); }
	});

	page.on('click', function(e){
		e.preventDefault();

		//pagination buttons
		current = $('.navigation-pager__' + gallery + ' .page-active');
		clicked = $(this);

		//is selected page before or after current page
		topage = parseInt(clicked.text());
		onpage = parseInt(current.text());
		if(topage > onpage) {
			//swipes left
			for(var i = onpage; i < topage; i++){
				$(container + i).addClass('prev gallery-table__container--hidden').removeClass('gallery-table__container--active')
					.next().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden next');
			}
		} else if(topage < onpage) {
			//swipes right
			for(var k = onpage; k > topage; k--){
				$(container + k).addClass('next gallery-table__container--hidden').removeClass('gallery-table__container--active')
					.prev().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden prev');
			}
		}

		//update active pagination buttons
		current.removeClass('page-active');
		clicked.addClass('page-active');

		//hover state updates based on position
		if(topage === last) {
			next.removeClass('hover-page');
			prev.addClass('hover-page');
		}
		else if(topage === 1) {
			prev.removeClass('hover-page');
			next.addClass('hover-page');
		}
		else {
			prev.addClass('hover-page');
			next.addClass('hover-page');
		}
	});
}

function toggleNextPrev(btn, direction, last, gallery) {
	var active = $('.navigation-pager__' + gallery + ' .page-active');
	var current = $('.' + gallery + ' > .gallery-table__container--active');

	//cant go forward or back anymore
	if((!current.prev().length && direction === 'prev') || (!current.next().length && direction === 'next'))
		return false;

	//increment or decrement depending on direction
	if(direction === 'prev') {
		current.addClass('next gallery-table__container--hidden').removeClass('gallery-table__container--active');
		current.prev().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden prev');
		active.prev().addClass('page-active');
	}
	else {
		current.addClass('prev gallery-table__container--hidden').removeClass('gallery-table__container--active');
		current.next().addClass('gallery-table__container--active').removeClass('gallery-table__container--hidden next');
		active.next().addClass('page-active');
	}
	current = $('.' + gallery + ' > .gallery-table__container--active');	//update current (visible) container
	active.removeClass('page-active');

	//pagination next prev styling
	//remove hoverable state if no more pages in either direction
	if(current.attr('class').includes('container-page-1') || current.attr('class').includes('container-page-' + last))
		$(btn).toggleClass('hover-page');

	return true;
}