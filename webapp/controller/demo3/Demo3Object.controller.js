sap.ui.define([
    "com/sap/flight/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Fragment, MessageToast, JSONModel, MessageBox) {
        "use strict";

        return BaseController.extend("com.sap.flight.controller.demo3.Demo3Object", {
            constructor: function () {
                this._fragments = {};
                this._oViewModel = new JSONModel({
                    delay: 0,
                    busy: false,
                    show: false,
                    required: false
                });
            },
            onInit: function () {
           

                this._oResourceBundle = this.getResourceBundle();
                this._oODataModel = this.getOwnerComponent().getModel();
                var oRouter = this.getRouter();
                oRouter.getTargets().getTarget("demo3Object").attachDisplay(null, this._onDisplay, this);
                this.setModel(this._oViewModel, "viewModel");

            },
            onSave: function (oEvent) {
                var oModel = this.getModel();
                var that = this;
                // abort if the  model has not been changed
                if (!oModel.hasPendingChanges()) {
                    MessageBox.information(
                        this._oResourceBundle.getText("noChangesMessage"), {
                        id: "noChangesInfoMessageBox",
                        styleClass: that.getOwnerComponent().getContentDensityClass()
                    }
                    );
                    return;
                }
                this.getModel("viewModel").setProperty("/busy", true);
                oModel.setRefreshAfterChange(false);//不添加这段代码，修改后不会显示message manager
                oModel.submitChanges({
                    success: function (oData) {
                        this.getModel("viewModel").setProperty("/busy", false);
                        var oMessage = this.getModel("message");
                        // oMessage.setData(oData);
                    }.bind(this), error: function (oError) {
                        this.getModel("viewModel").setProperty("/busy", false);
                    }.bind(this)
                });

            },
            /**
             * Event handler (attached declaratively) for the view cancel button. Asks the user confirmation to discard the changes. 
             * @function
             * @public
             */
            onCancel: function () {
                // check if the model has been changed
                if (this.getModel().hasPendingChanges()) {
                    // get user confirmation first
                    this._showConfirmQuitChanges(); // some other thing here....
                } else {
                    // cancel without confirmation
                    this._navBack();
                }
            },
            onDelete : function (oEvent) {
                var oForm = this.byId("demo3New-smartform");

                var sPath = oForm.getBindingContext().getPath();
                this.getView().getModel().remove(sPath);
            },
            /**
             * Handles the onDisplay event which is triggered when this view is displayed 
             * @param {sap.ui.base.Event} oEvent the on display event
             * @private
             */
            _onDisplay: function (oEvent) {
                sap.ui.getCore().getMessageManager().removeAllMessages();
                var oData = oEvent.getParameter("data");
                
                if (oData && oData.mode === "edit") {
                    this._onEdit(oEvent);
                } else {
                    this._onCreate(oEvent);
                }
            },
            /**
             * Opens a dialog letting the user either confirm or cancel the quit and discard of changes.
             * @private
             */
            _showConfirmQuitChanges: function () {
                var oComponent = this.getOwnerComponent(),
                    oModel = this.getModel();
                var that = this;
                MessageBox.confirm(
                    this._oResourceBundle.getText("confirmCancelMessage"), {
                    styleClass: oComponent.getContentDensityClass(),
                    onClose: function (oAction) {
                        if (oAction === sap.m.MessageBox.Action.OK) {
                            oModel.resetChanges();
                            that._navBack();
                        }
                    }
                }
                );
            },
            /**
             * Navigates back in the browser history, if the entry was created by this app.
             * If not, it navigates to the Details page
             * @private
             */
            _navBack: function () {
                var oHistory = sap.ui.core.routing.History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();

                this.getView().unbindObject();
                if (sPreviousHash !== undefined) {
                    // The history contains a previous entry
                    history.go(-1);
                } else {
                    this.getRouter().getTargets().display("demo3");
                }
            },
            /**
             * Prepares the view for editing the selected object
             * @param {sap.ui.base.Event} oEvent the  display event
             * @private
             */
            _onEdit: function (oEvent) {
                // var oViewModel = this.getModel("viewModel");
     
                var oData = oEvent.getParameter("data");
                var oFragment = this._getFragment(this._setFirstLetterUpperCase(oData.viewName));
                this.byId("demo3Object-page").removeAllContent();
                this.byId("demo3Object-page").insertContent(oFragment);
                var oForm = this.byId("demo3New-smartform");
                oForm.bindElement(oData.objectPath);
             
            },
            /**
             * Prepares the view for creating new object
             * @param {sap.ui.base.Event} oEvent the  display event
             * @private
             */
            _onCreate: function (oEvent) {
                // var sName = oEvent.getParameter("name");
                this._oData = oEvent.getParameter("data");
                var oFragment = this._getFragment(this._setFirstLetterUpperCase(this._oData.viewName));
                this.byId("demo3Object-page").removeAllContent();
                this.byId("demo3Object-page").insertContent(oFragment);
                var oForm = this.byId("demo3New-smartform");
                oForm.unbindObject();
                var oContent = this.getView().getModel().createEntry("/Sflight2Set",
                    {
                        properties: { Carrid: "AA", Fldate: new Date() },
                        success: this._fnEntityCreated.bind(this),
                        error: this._fnEntityCreationFailed.bind(this)
                    });
                oForm.setBindingContext(oContent);
            },
            /**
             * Handles the success of updating an object
             * @private
             */
            _fnUpdateSuccess: function () {
                this.getModel("viewModel").setProperty("/busy", false);
            },
            /**
             * Handles the success of creating an object
             *@param {object} oData the response of the save action
            * @private
            */
            _fnEntityCreated: function (oData) {

                this.getModel("viewModel").setProperty("/busy", false);
            },

            /**
             * Handles the failure of creating/updating an object
             * @private
             */
            _fnEntityCreationFailed: function () {
                this.getModel("viewModel").setProperty("/busy", false);
            },

            _onRouteMatched: function (oEvent) {
                var sName = oEvent.getParameter("name");
                var oFragment = this._getFragment(this._setFirstLetterUpperCase(sName));
                this.byId("demo3Object-page").removeAllContent();
                this.byId("demo3Object-page").insertContent(oFragment);
                if (sName === "demo3New") {
                    var oForm = this.byId("demo3New-smartform");
                    var oContent = this.getView().getModel().createEntry("/Sflight2Set", { properties: { Carrid: "AA", Fldate: new Date() } });
                    oForm.setBindingContext(oContent);
                }
            },
            _getFragment: function (sName) {
                var oFragment = this._fragments[sName];
                if (oFragment) {
                    return oFragment;
                }
                oFragment = sap.ui.xmlfragment(this.getView().getId(), "com.sap.flight.view.demo3." + sName, this);
                this._fragments[sName] = oFragment;
                return this._fragments[sName];
            },
            _setFirstLetterUpperCase: function (sText) {
                return sText.charAt(0).toUpperCase() + sText.slice(1);
            }

        });
    });