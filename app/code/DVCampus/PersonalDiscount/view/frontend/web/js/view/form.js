define([
    'jquery',
    'ko',
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/modal/alert',
    'Magento_Ui/js/modal/modal',
    'mage/translate',
    'mage/cookies'
], function ($, ko, Component, customerData, alert) {
    'use strict';

    return Component.extend({
        defaults: {
            action: '',
            customerName: '',
            customerEmail: '',
            customerMessage: '',
            productId: 0,
            template: 'DVCampus_PersonalDiscount/form'
        },

        /**
         * @returns {*}
         */
        initObservable: function () {
            this._super()
                .observe(['customerName', 'customerEmail', 'customerMessage']);

            this.updatePersonalDiscountData(customerData.get('personal-discount')());
            customerData.get('personal-discount').subscribe(this.updatePersonalDiscountData.bind(this));

            return this;
        },

        /**
         * Update observable values with the ones from the localStorage
         * @param {Object} personalDiscountData
         */
        updatePersonalDiscountData: function (personalDiscountData) {
            if (personalDiscountData.hasOwnProperty('name')) {
                this.customerName(personalDiscountData.name);
            }

            if (personalDiscountData.hasOwnProperty('email')) {
                this.customerEmail(personalDiscountData.email);
            }
        },

        /**
         * Initialize modal popup and form validators
         */
        initModal: function (element) {
            this.$form = $(element);
            this.$modal = this.$form.modal({
                buttons: []
            });

            $(document).on('dv_campus_personal_discount_form_open', this.openModal.bind(this));
        },

        /**
         * Open modal dialog
         */
        openModal: function () {
            this.$modal.modal('openModal');
        },

        /**
         * Send form data to the server
         */
        sendPersonalDiscountRequest: function () {
            if (!this.validateForm()) {
                return;
            }

            this.ajaxSubmit();
        },

        /**
         * Validate request form
         */
        validateForm: function () {
            return this.$form.validation().valid();
        },

        /**
         * Submit request via AJAX. Add form key to the post data.
         */
        ajaxSubmit: function () {
            let payload = {
                name: this.customerName(),
                email: this.customerEmail(),
                message: this.customerMessage(),
                'product_id': this.productId,
                'form_key': $.mage.cookies.get('form_key'),
                isAjax: 1
            };

            $.ajax({
                url: this.action,
                data: payload,
                type: 'post',
                dataType: 'json',
                context: this,

                /** @inheritdoc */
                beforeSend: function () {
                    $('body').trigger('processStart');
                },

                /** @inheritdoc */
                success: function (response) {
                    alert({
                        title: $.mage.__('Success'),
                        content: response.message
                    });
                },

                /** @inheritdoc */
                error: function () {
                    alert({
                        title: $.mage.__('Error'),
                        /*eslint max-len: ["error", { "ignoreStrings": true }]*/
                        content: $.mage.__('Your request can\'t be sent. Please, contact us if you see this message.')
                    });
                },

                /** @inheritdoc */
                complete: function () {
                    $('body').trigger('processStop');
                    this.$modal.modal('closeModal');
                }
            });
        }
    });
});
