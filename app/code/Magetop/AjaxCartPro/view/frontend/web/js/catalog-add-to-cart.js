/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'jquery',
    'mage/translate',
    'jquery/ui'
], function($, $t) {
    "use strict";

    $.widget('mage.catalogAddToCart', {

        options: {
            processStart: null,
            processStop: null,
            bindSubmit: true,
            minicartSelector: '[data-block="minicart"]',
            messagesSelector: '[data-placeholder="messages"]',
            productStatusSelector: '.stock.available',
            addToCartButtonSelector: '.action.tocart',
            addToCartButtonDisabledClass: 'disabled',
            addToCartButtonTextWhileAdding: $t('Adding...'),
            addToCartButtonTextAdded: $t('Added'),
            addToCartButtonTextDefault: $t('Add to Cart'),
            namespace: 'ajaxcartpro'
        },

        _create: function() {
            if (this.options.bindSubmit) {
                this._bindSubmit();
            }
        },

        _bindSubmit: function() {
            var self = this;
            this.element.on('submit', function(e) {
                e.preventDefault();
                self.submitForm($(this));
            });
        },

        isLoaderEnabled: function() {
            return this.options.processStart && this.options.processStop;
        },

        submitForm: function(form) {
            var self = this;
            if (form.has('input[type="file"]').length && form.find('input[type="file"]').val() !== '') {
                self.element.off('submit');
                form.submit();
            } else {
                self.ajaxSubmit(form);
            }
        },
		
		modifyUrl: function(url) {
			var self = this;
			var terms = ['checkout'];
			$.each(terms,function(key,val){
				url = url.replace(val,self.options.namespace);
			});
			return url;	
		},

		imageAnimation: function(form){
			$('#footer-mini-cart').slideDown(300,'linear',function(){	
				
				$('#footer-cart-trigger').addClass('active');
				if( form.parents('.product-item').length > 0 ){
					var $parent = form.parents('.product-item').first();
					if($parent.find('.product-image-photo').length > 0){
						var src = $parent.find('.product-image-photo').first().attr('src');
						var width = $parent.find('.product-image-photo').first().width();
					}else{
						var src = $parent.find('.product-image').first().attr('src');
						var width = $parent.find('.product-image').first().width();
					}
				}else{
					var $parent = $('.fotorama__stage__shaft').first();
					var $fotoramaImg = $parent.find('.fotorama__img').first(); 
					var src = $fotoramaImg.attr('src');
					var width = $fotoramaImg.width();
				}
				
				
				var $img = $('<img class="adding-product-img" style="display:none;" />'); //$('#adding-product-img');
				$('body').append($img);
				var imgTop = $parent.offset().top;
				var imgLeft = $parent.offset().left;
				$img.attr('src',src);
				$img.css({
					'opacity': 1,
					'width': width,
					'max-width':'300px',
					'position': 'absolute',
					'top': imgTop +'px',
					'left': imgLeft +'px',
					'z-index': 1000,
				});
				var $cart = $('.footer-mini-cart .cart-icon').first();
				$cart.removeClass('tada');
				var productId = form.find('input[name="product"]').val();
				imgTop = $cart.offset().top;
				imgLeft = $cart.offset().left + ($cart.width() - 20)/2 ;
				$img.animate({
					'opacity': 0,
					'top': imgTop +'px',
					'left': imgLeft +'px',
					'width': '20px',
				},1500,'linear',function(){
					$img.replaceWith('');
					$cart.addClass('animated tada');
				});
			});
		},
		
        ajaxSubmit: function(form) {
			
            var self = this;
			$(self.options.minicartSelector).trigger('contentLoading');
            self.disableAddToCartButton(form);
			
			
			
			var ajaxUrl = form.attr('action');
			ajaxUrl = self.modifyUrl(ajaxUrl);
			if($('body').hasClass('cdz-qs-view')){
				if(form.attr('id') == 'product_addtocart_form'){
					self.imageAnimation(form);
				}else{
					return;
				}
			}else{
				self.imageAnimation(form);
			}
			$.ajax({
                url: ajaxUrl,
                data: form.serialize(),
                type: 'post',
                dataType: 'json',
                beforeSend: function() {
                    if (self.isLoaderEnabled()) {
                        $('body').trigger(self.options.processStart);
                    }
                },
                success: function(res) {
                    if (self.isLoaderEnabled()) {
                        $('body').trigger(self.options.processStop);
                    }

                    if (res.backUrl) {
                        window.location = res.backUrl;
                        return;
                    }
                    if (res.messages) {
                        $(self.options.messagesSelector).html(res.messages);
                    }
                    if (res.minicart) {
                        $(self.options.minicartSelector).replaceWith(res.minicart);
                        $(self.options.minicartSelector).trigger('contentUpdated');
                    }
                    if (res.product && res.product.statusText) {
                        $(self.options.productStatusSelector)
                            .removeClass('available')
                            .addClass('unavailable')
                            .find('span')
                            .html(res.product.statusText);
                    }
					if(res.product){
						window.addedItem(res.product);
						window.crosssell(res.crosssell);
					}
					if(res.cart){
						window.ajaxcart(res.cart);
						res.cart.trigger = true;
						window.cartSidebar(res.cart);	
					}
                    self.enableAddToCartButton(form);
                }
            });
        },

        disableAddToCartButton: function(form) {
            var addToCartButton = $(form).find(this.options.addToCartButtonSelector);
            addToCartButton.addClass(this.options.addToCartButtonDisabledClass);
            addToCartButton.attr('title', this.options.addToCartButtonTextWhileAdding);
            addToCartButton.find('span').text(this.options.addToCartButtonTextWhileAdding);
        },

        enableAddToCartButton: function(form) {
            var self = this,
                addToCartButton = $(form).find(this.options.addToCartButtonSelector);

            addToCartButton.find('span').text(this.options.addToCartButtonTextAdded);
            addToCartButton.attr('title', this.options.addToCartButtonTextAdded);

            setTimeout(function() {
                addToCartButton.removeClass(self.options.addToCartButtonDisabledClass);
                addToCartButton.find('span').text(self.options.addToCartButtonTextDefault);
                addToCartButton.attr('title', self.options.addToCartButtonTextDefault);
            }, 1000);
        }
    });

    return $.mage.catalogAddToCart;
});
