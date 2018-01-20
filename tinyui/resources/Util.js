var oFirstDialog;
function openFirstDialog() {
	if (oFirstDialog) {
		oFirstDialog.open();
	}
	else
	{
		oFirstDialog = new sap.ui.commons.Dialog({
			width: "400px",
			heigth: "550px",
			title: "Country Details",
			applyContentPadding: true,
			modal: true,
			content: [new sap.ui.commons.form.SimpleForm({
				content: [
					new sap.ui.core.Title({text: "Country Name"}),
					new sap.ui.commons.Label({text: "name"}),
					new sap.ui.commons.TextField({value: "", id: "name"}),
					new sap.ui.commons.Label({text: "partof"}),
					new sap.ui.commons.TextField({value: "", id: "partof"})
					]
			})] //sap.uo.cor.Control
		});
		
		oFirstDialog.addButton(new sap.ui.commons.Button({
			text: "OK",
			press: function() {
				var name = sap.ui.getCore().byId("name").getValue();
				var partof = sap.ui.getCore().byId("partof").getValue();
				var payload = {};
				payload.name = name;
				payload.partof = partof;
				var insertdata = JSON.stringify(payload);
				//$.ajax ist offenbar eine jquery - Mehudie die in sapui5 eingebaut ist
				$.ajax({
					type: "POST",
					url: "country/country.xsjs",
					contentType: "application/json",
					data: insertdata,
					dataType: "json", //dieses Formt wird bei der Rückantwort erwartet
					crossDomain: "true",
					success: function(data) { //dies Funktion wird wird nach bei Erfolg aufgerufen 
						oFirstDialog.close();
						sap.ui.getCore().byId("tinytab").getModel().refresh(true);
						alert("Data inserted successfully!");
					},
					error: function(data) { //diese Funktion wird bei Fehler aufgerufen
						var message = JSON.stringify(data);
						alert(message);
					}
				});
			}
		}));
		oFirstDialog.open();
	}
} 

$(function() {
	//one time fetch of CSRF token
	//query.js - syntax
	$.ajax({
		type: "GET",
		url: "/",
		headers: {"X-Csrf-token": "Fetch"},
		success: function(res, status, xhr) {
			var sHeaderCsrfToken = "X-Csrf-Token";
			var sCsrfToken = xhr.getResponseHeader(sHeaderCsrfToken);
			//for POST, PUT, and DELETE requests, add the CSRF token to the header
			$(document).ajaxSend(function(event, jqxhr, settings) {
				if (settings.type==="POST" || settings.type==="PUT" || settings.type==="DELETE") {
					jqxhr.setRequestHeader(sHeaderCsrfToken, sCsrfToken);
				}
			});
		}
	});
});