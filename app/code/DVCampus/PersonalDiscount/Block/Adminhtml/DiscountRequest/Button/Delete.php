<?php

declare(strict_types=1);

namespace DVCampus\PersonalDiscount\Block\Adminhtml\DiscountRequest\Button;

use DVCampus\PersonalDiscount\Model\Authorization;

class Delete implements \Magento\Framework\View\Element\UiComponent\Control\ButtonProviderInterface
{
    private \Magento\Backend\Model\UrlInterface $urlBuilder;

    private \Magento\Framework\App\RequestInterface $request;

    private \Magento\Framework\Escaper $escaper;

    /**
     * Delete constructor.
     * @param \Magento\Backend\Model\UrlInterface $urlBuilder
     * @param \Magento\Framework\App\RequestInterface $request
     * @param \Magento\Framework\Escaper $escaper
     */
    public function __construct(
        \Magento\Backend\Model\UrlInterface $urlBuilder,
        \Magento\Framework\App\RequestInterface $request,
        \Magento\Framework\Escaper $escaper
    ) {
        $this->urlBuilder = $urlBuilder;
        $this->request = $request;
        $this->escaper = $escaper;
    }

    /**
     * @return array
     */
    public function getButtonData(): array
    {
        $url = $this->urlBuilder->getUrl('*/*/delete');
        $message = $this->escaper->escapeJs($this->escaper->escapeHtml('Are you sure you want to delete this request?'));
        $discountRequestId = (int) $this->request->getParam('discount_request_id');

        return [
            'label' => __('Delete'),
            'class' => 'delete primary',
            'on_click' => "deleteConfirm('{$message}', '{$url}', {data:{discount_request_id:$discountRequestId}})",
            'data_attribute' => [
                'mage_init' => [
                    'button' => [
                        'event' => 'delete'
                    ],
                ],
                'form-role' => 'delete'
            ],
            'aclResource' => Authorization::ACTION_DISCOUNT_REQUEST_DELETE,
            'sort_order' => 20
        ];
    }
}
