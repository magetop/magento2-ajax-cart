<?php
/**
 * Copyright © 2016 Magetop. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magetop\AjaxCartPro\Block\Product;

use Magento\Customer\CustomerData\SectionSourceInterface;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Framework\View\Element\AbstractBlock;

class Crosssell extends \Magento\Catalog\Block\Product\ProductList\Crosssell
{
	protected $_itemCollection;
	protected $_checkoutSession;
	protected $_catalogProductVisibility;
	protected $_checkoutCart;
	protected $moduleManager;
	/**
     * {@inheritdoc}
     */
	/*public function getProductPrice(\Magento\Catalog\Model\Product $product, $idSuffix = '')
    {
        
        $priceRender = $this->getLayout()->createBlock('Magento\Framework\Pricing\Render');

        $price = '';
		
        if ($priceRender) {
			
            $price = $priceRender->render(
                \Magento\Catalog\Pricing\Price\FinalPrice::PRICE_CODE,
                $product,
                [
                    'price_id' => 'product-price-' . $product->getId() . $idSuffix,
                    'display_minimal_price' => true,
                    'zone' => \Magento\Framework\Pricing\Render::ZONE_ITEM_LIST,
                ]
            );
        }
        return $price;
    }*/
	protected function _beforeToHtml()
    {
		$this->_prepareData();
		$priceRender = $this->getLayout()->getBlock('product.price.render.default');
		$this->setTemplate('Magetop_AjaxCartPro::product/list/items.phtml');
        return parent::_beforeToHtml();
    }
	protected function _prepareData()
    {
        //$product = $this->_coreRegistry->registry('product');
        /* @var $product \Magento\Catalog\Model\Product */
		
		$productId = (int)$this->getRequest()->getParam('product');
		$objectManager = \Magento\Framework\App\ObjectManager::getInstance();
		$product = $objectManager->get('Magento\Catalog\Model\Product')->load($productId);
		
        $this->_itemCollection = $product->getCrossSellProductCollection()->addAttributeToSelect(
            $this->_catalogConfig->getProductAttributes()
        )->setPositionOrder()->addStoreFilter();
		
        $this->_itemCollection->setPageSize(4)->load();

        foreach ($this->_itemCollection as $product) {
            $product->setDoNotUseCategoryId(true);
        }
        return $this;
    }
	public function getItems()
    {
        return $this->_itemCollection;
    }
}