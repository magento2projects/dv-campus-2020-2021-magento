define([
    'jquery',
    'Magento_Ui/js/modal/alert',
    'mage/translate'
], function ($, alert) {
    'use strict';

    /**
     * @param {Object} payload
     * @param {String} action
     */
    return function (payload, action) {
        return $.ajax({
            url: action,
            data: payload,
            type: 'post',
            dataType: 'json',

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
            }
        });
    };
});
