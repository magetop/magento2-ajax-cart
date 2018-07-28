/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define([
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'jquery',
    'ko',
	'Magento_Ui/js/modal/modal'
], function (Component, customerData, $, ko) {
    'use strict';
	function getCrosssell(Component){
		var crosssellUrl = "http://45.32.38.158/magento2/ajaxcartpro/product/crosssell";
		var id;
		if(window.addedItem){
			console.log(window.addedItem().id);
			id = window.addedItem().id;
		}else{
			id = ''	;
		}
		var crosssell = {};
		$.ajax({
			url: crosssellUrl,
			type: "GET",
			data: {product: id},
			cache: false,
			success: function(res){
				crosssell.html = res;
				//Component.crosssell({html:res});
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				console.error(textStatus);
			}
		});
		if(crosssell.html){
			return crosssell.html;
		}else{
			return false;
		}
	}
    return Component.extend({
		ajaxcart: ko.observable({}),
		crosssell: ko.observable({}),
		addedItem: ko.observable({}),
		
        initialize: function () {
			var self = this;
            this._super();
			this.addedItem({success:false});
			window.addedItem = self.addedItem;
			window.ajaxcart = self.ajaxcart;
			window.crosssell = self.crosssell;
			ko.computed({
				read: function(){
					var crosssellUrl = "http://45.32.38.158/magento2/ajaxcartpro/product/crosssell";
					var id;
					if(window.addedItem){
						id = window.addedItem().id;
					}else{
						id = ''	;
					}
					var crosssell = {html: ''};
					if(id != ''){
						$.ajax({
							url: crosssellUrl,
							type: "GET",
							data: {product: id},
							cache: false,
							success: function(res){
								crosssell.html = res;
								window.crosssell(crosssell);
							},
							error: function(XMLHttpRequest, textStatus, errorThrown){
								console.error(textStatus);
							}
						});
					}
					
					return crosssell
				},
				write: function(value){},
				owner: self
			});
			
			var $ajaxPopup = $('#ajax-cart-container');
			$ajaxPopup.modal({
				innerScroll: true,
				trigger: '.tocart',
				wrapperClass: 'ajaxcart-modal',
				buttons: [],
				opened: function(){
					window.addedItem({success:false});
				},
				closed: function(){
				}	
			});
			
        },
		
    });
});
