sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("crud.controller.View1", {
        onInit: function () {
            this.onReadAll();
        },
        onReadAll: function(){
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/Products",{
                success:function(odata){
                    console.log(odata);
                    var jModel = new sap.ui.model.json.JSONModel(odata);
                    that.getView().byId("idProducts").setModel(jModel);
                },error: function(oError){
                    console.log(oError);
                } 
            });
        },
        onReadFilters:function(fieldValue,ratingValue){
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            var oFilter = new sap.ui.model.Filter(fieldValue, 'EQ', ratingValue);
            oModel.read("/Products", {
                filters: [oFilter],
                success:function(odata){
                    console.log(odata);
                    var jModel = new sap.ui.model.json.JSONModel(odata);
                    that.getView().byId("idProducts").setModel(jModel);
                }, error:function(oError){
                    console.log(oError);
                }
            });
        },
        onFilter: function() {
            var fieldValue = this.getView().byId("filterField").getValue();
            var ratingValue = this.getView().byId("filterRating").getValue();
            this.onReadFilters(fieldValue,ratingValue);
        },
        onReadSorter: function(sSortBy, bDescending){
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            var oSorter = new sap.ui.model.Sorter(sSortBy, bDescending);
            oModel.read("/Products", {
                sorters: [oSorter], success:function(odata){
                    console.log(odata);
                    var jModel = new sap.ui.model.json.JSONModel(odata);
                    that.getView().byId("idProducts").setModel(jModel);
                }, error:function(oError){
                    console.log(oError);
                }
            });
        },
        onSort: function(sSortBy){
            var bDescending = this._bDescending;
            this.onReadSorter(sSortBy, bDescending);
            this._bDescending = !bDescending;  // Toggle sorting order for next sort
        },
        onReadParameters:function() {
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/Products",{
                urlParameters: {$skip: 0, $top: 4},
                success:function(odata){
                    console.log(odata);
                    var jModel = new sap.ui.model.json.JSONModel(odata);
                    that.getView().byId("idProducts").setModel(jModel);
                }, error:function(oError){
                    console.log(oError);
                }
            });
        },
        onReadKey:function() {
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/Products(5)",{
                success:function(odata){
                    console.log(odata);
                    var jModel = new sap.ui.model.json.JSONModel({results: [odata]});
                    that.getView().byId("idProducts").setModel(jModel);
                }, error:function(oError){
                    console.log(oError);
                }
            });
        },
        onEdit:function(oEvent) {
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(false);
            if (oEvent.getSource().getText() === "Edit") {
                oEvent.getSource().setText("Submit");
                oEvent.getSource().getParent().getParent().getCells()[3].setEditable(true);
            } else {
                oEvent.getSource().setText("Edit");
                oEvent.getSource().getParent().getParent().getCells()[3].setEditable(false);
                var oInput = oEvent.getSource().getParent().getParent().getCells()[3].getValue();
                var oId = oEvent.getSource().getBindingContext().getProperty("ID");
                oModel.update("/Products(" + oId + ")", {Rating: oInput}, {
                    success:function(odata){
                        that.onReadAll();   
                    }, error:function(oError){
                        console.log(oError);
                    }
                });
            }
        },
        onDuplicate:function(oEvent) {
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(false);
            var oDuplicateData = oEvent.getSource().getBindingContext().getObject();
            oDuplicateData.ID = 100 + oDuplicateData.ID;
            oModel.create("/Products", oDuplicateData, {
                success:function(odata){
                    that.onReadAll();   
                }, error:function(oError){
                    console.log(oError);
                }
            });
        },
        onDelete:function(oEvent) {
            var that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.setUseBatch(false);
            var oId = oEvent.getSource().getBindingContext().getProperty("ID");
            oModel.remove("/Products(" + oId + ")", {
                success:function(odata){
                    that.onReadAll();   
                }, error:function(oError){
                    console.log(oError);
                }
            });
        }
    });
});
