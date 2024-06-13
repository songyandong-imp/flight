sap.ui.define([
    "com/sap/flight/controller/BaseController",
    // "com/sap/flight/lib/watermark"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("com.sap.flight.controller.App", {
            onInit: function () {

            },
            onBeforeRendering:function(){
                // watermark.load({ watermark_txt: "测试水印,1021002301,测试水印,100101010111101" });
            },
            onAfterRendering:function(){
                // watermark.load({ watermark_txt: "测试水印,1021002301,测试水印,100101010111101" });
            }
        });
    });
