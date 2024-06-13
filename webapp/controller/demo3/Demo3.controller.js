sap.ui.define([
    "com/sap/flight/controller/BaseController",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, exportLibrary, Spreadsheet, JSONModel, Filter, FilterOperator) {
        "use strict";

        return BaseController.extend("com.sap.flight.controller.demo3.Demo3", {
            onInit: function () {
                // var oBeginDate = new Date();
                // oBeginDate.setDate(oBeginDate.getDate() - 30);
                // var oFilterModel = new JSONModel({
                //     beginDate: oBeginDate,
                //     endDate: new Date()
                // });
                // this.getView().setModel(oFilterModel, "filterModel");

            },
            onFldateValueHelpRequest: function (oEvent) {
                this.oPersonalizationDialog = sap.ui.xmlfragment("smart.HTML5Module.fragment.p13nDialog", this);
                this.getView().addDependent(this.oPersonalizationDialog);
                this.oPersonalizationDialog.open();
            },
            onAdd: function (oEvent) {
                this.getRouter().getTargets().display("demo3Object", { mode: "create", viewName: "demo3New" });
            },
            onEdit: function (oEvent) {
                var oTable = this.byId("smartTable").getTable();
                var aPaths = oTable.getSelectedContextPaths();
                if (aPaths.length === 0) {
                    sap.m.MessageToast.show("Please select a record to edit");
                    return;
                }


                this.getRouter().getTargets().display("demo3Object", { mode: "edit",viewName: "demo3New", objectPath: aPaths[0] });
            },
            onDelete: function (oEvent) {
                var oTable = this.byId("smartTable").getTable();
                var aPaths = oTable.getSelectedContextPaths();
                if (aPaths.length === 0) {
                    sap.m.MessageToast.show("Please select a record to delete");
                    return;
                }


                this.getModel().remove(aPaths[0]);
                this.getModel().submitChanges();
            },
            onBeforeRebindTable: function (oEvent) {

            },
            onBeforeExport: function (oEvent) {
                var oExportSettings = oEvent.getParameter("exportSettings");
                oExportSettings.fileName = "Flight_Report.xlsx";

            }

        });
    });