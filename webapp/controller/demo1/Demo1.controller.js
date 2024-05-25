sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, exportLibrary, Spreadsheet) {
        "use strict";

        return Controller.extend("com.sap.flight.controller.demo1.Demo1", {
            onInit: function () {

            },
            onInitSmartFilterBar: function (oEvent) {
                var oSmartFilterBar = oEvent.getSource();
                // var oControlFldate = oSmartFilterBar.getControlByKey("Fldate");
                var oFilterData = oSmartFilterBar.getFilterData();
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY-MM-dd" });
                var datetoDay = dateFormat.format(new Date());
                oFilterData.Fldate = {
                    ranges: [
                        {
                            "exclude": false,
                            "keyField": "Fldate",
                            "operation": "EQ",
                            "tokenText": "=" + datetoDay, //Concatenate >= sign to date
                            "value1": new Date(),  // Actual date value
                            "value2": null
                        }
                    ]
                };

                oSmartFilterBar.setFilterData(oFilterData);
                // oControlFldate.setValue(new Date());

                // var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY-MM-dd" });
                // var datetoDay = dateFormat.format(new Date());
                // // Create a new token
                // var oToken = new sap.m.Token({
                //     key: "Fldate", // any unique value
                //     text: ">=" + datetoDay,  //Concatenate >= sign to date
                //     tooltip: ">=" + datetoDay
                // });
                // // JSON to declare the values we want in actual filter
                // var valueComp = {
                //     "exclude": false,
                //     "keyField": "Fldate",
                //     "operation": "GE",
                //     "tokenText": ">=" + datetoDay, //Concatenate >= sign to date
                //     "value1": datetoDay,  // Actual date value
                //     "value2": undefined
                // }
                // // add the above defined values to CustomData
                // var customData = new sap.ui.core.CustomData("data", {
                //     key: "custdata", // any unique value
                //     value: valueComp
                // }); // JSON declared above
                // oToken.addCustomData(customData); // Add custom data to 
                // oControlFldate.addToken(oToken); // add token to the filter field.

            },
            onBeforeExport: function (oEvent) {
                var oExportSettings = oEvent.getParameter("exportSettings");
                oExportSettings.fileName = "Flight_Report.xlsx";

            },
            onBeforeRebindTable: function (oEvent) {
                var oTable = oEvent.getSource();
                var oSmartFilterBar = this.byId("smartFilterBar");
                var oFilterBarData = oSmartFilterBar.getFilterData();
                // 设置列的宽度
                // var i = 0;
                oTable.getTable().getColumns().forEach(function (oLine) {
                    oLine.setHAlign("Center");
                    oLine.setWidth("10rem");
                    // oLine.getParent().autoResizeColumn(i);
                    // i++;
                });

            },
            onExport: function (oEvent) {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId('smartTable');
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('rows');

                aCols = this._createColumnConfig();

                var oModel = oRowBinding.getModel();

                var oDataSource = {
                    type: 'odata',
                    dataUrl: oRowBinding.getDownloadUrl ? oRowBinding.getDownloadUrl() : null,
                    serviceUrl: this._sServiceUrl,
                    headers: oModel.getHeaders ? oModel.getHeaders() : null,
                    count: oRowBinding.getLength ? oRowBinding.getLength() : null,
                    useBatch: true // Default for ODataModel V2
                }

                // 判断是全部下载还是下载选中的数据
                var aSelectedItems = [];
                var aSelectedIndices = oTable.getSelectedIndices();
                // for (var i = 0; i < aSelectedIndices.length; i++) {
                // aSelectedItems.push(oTable.getContextByIndex(aSelectedIndices[i]).getObject());
                // }
                if (aSelectedIndices.length == 0) {
                    aSelectedIndices.forEach(index => {
                        var oContext = oTable.getContextByIndex(index);
                        var sPath = oContext.getPath();
                        var oSelectedItem = oTable.getModel().getProperty(sPath);
                        aSelectedItems.push(oSelectedItem);
                    });
                    oDataSource = aSelectedItems;
                }

                oSettings = {
                    workbook: { columns: aCols },
                    dataSource: oDataSource,
                    fileName: 'Column formatting sample.xlsx',
                    worker: true
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            _createColumnConfig: function () {
                var aCols = [];

                /* 1. Add a simple text column */
                aCols.push({
                    label: 'Text',
                    type: EdmType.String,
                    property: 'SampleString',
                    width: 20,
                    wrap: true
                });

                /* 2. Add a concatenated text column */
                aCols.push({
                    label: 'Concatenated Text',
                    type: EdmType.String,
                    property: ['Region', 'SampleCurrency'],
                    template: '{0} accepts {1}'
                });


                return aCols;
            },
        });
    });