var config = {
    map: {
        '*': {
			magetopSidebar: 'Magetop_AjaxCartPro/js/sidebar',
            catalogAddToCart: 'Magetop_AjaxCartPro/js/catalog-add-to-cart',
			catalogAddToCompare: 'Magetop_AjaxCartPro/js/catalog-add-to-compare'
        },
		'shim': {
    		'Magetop_AjaxCartPro/js/catalog-add-to-cart': ['catalogAddToCart'],
			'Magetop_AjaxCartPro/js/catalog-add-to-compare': ['mage/dataPost']
    	}
    }
};
