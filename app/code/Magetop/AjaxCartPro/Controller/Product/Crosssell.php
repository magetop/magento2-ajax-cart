<?php
/**
 * Product controller.
 *
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
namespace Magetop\AjaxCartPro\Controller\Product;

use Magento\Catalog\Controller\Product\View\ViewInterface;
use Magento\Catalog\Model\Product as ModelProduct;
use Magento\Framework\Controller\ResultFactory as ResultFactory;

class Crosssell extends \Magento\Framework\App\Action\Action
{
	protected $resultFactory;
	
	
	public function __construct(
        \Magento\Framework\App\Action\Context $context
    ) {
		$this->resultFactory = $context->getResultFactory();
		parent::__construct($context);
		
    }
   
    public function execute()
    {	
		$page = $this->resultFactory->create(ResultFactory::TYPE_LAYOUT);
		return $page;
	}
}
