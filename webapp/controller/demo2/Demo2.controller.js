sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, exportLibrary, Spreadsheet, JSONModel,Filter,FilterOperator) {
        "use strict";

        return Controller.extend("com.sap.flight.controller.demo2.Demo2", {
            onInit: function () {
                var oFilterModel = new JSONModel({
                    beginDate: new Date(),
                    endDate: new Date()
                });
                this.getView().setModel(oFilterModel, "filterModel");

            },
   
            onBeforeRebindTable: function (oEvent) {
                var oFilterModel = this.getView().getModel("filterModel");
                var oTable  = oEvent.getSource();
                var oParameters = oEvent.getParameter("bindingParams");
                oParameters.filters.push(new Filter("Fldate", FilterOperator.BT, oFilterModel.getProperty("/beginDate"),oFilterModel.getProperty("/endDate")));
                // 设置列的宽度
                // var i = 0;
                oTable.getTable().getColumns().forEach(function (oLine) {
                    oLine.setHAlign("Center");
                    oLine.setWidth("10rem");
                    // oLine.getParent().autoResizeColumn(i);
                    // i++;
                });
                // oTable.getTable().getColumns().forEach(function (oLine) {
                //     oLine.getParent().autoResizeColumn(oLine.getIndex());
                // });

            },
            onBeforeExport: function (oEvent) {
                var oExportSettings = oEvent.getParameter("exportSettings");
                oExportSettings.fileName = "Flight_Report.xlsx";

            }

        });
    });