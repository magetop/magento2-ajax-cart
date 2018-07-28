<?php
/**
 * Copyright © 2016 Magetop. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magetop\AjaxCartPro\CustomerData;

use Magento\Customer\CustomerData\SectionSourceInterface;
use Magento\Catalog\Model\ResourceModel\Product\Collection;
use Magento\Framework\View\Element\AbstractBlock;

class Crosssell extends \Magento\Framework\DataObject implements SectionSourceInterface
{
	protected $_itemCollection;
	protected $_checkoutSession;
	protected $_catalogProductVisibility;
	protected $_checkoutCart;
	protected $moduleManager;
	protected $crosssel;
	/**
     * {@inheritdoc}
     */
	public function __construct(
		\Magetop\AjaxCartPro\Block\Product\Crosssell $crosssel,
        \Magento\Framework\View\LayoutInterface $layout,
		\Magento\Framework\Pricing\Render\Layout $priceLayout,
        array $data = []
    ) {
        parent::__construct($data);
		$this->crosssel = $crosssel;
        $this->layout = $layout;
		$this->priceLayout = $priceLayout;
    }
    public function getSectionData()
    {
		$crosssell = $this->crosssel;
		$html = $crosssell->toHtml();
        return [
            'html' => json_encode($html)
        ];
    }
}