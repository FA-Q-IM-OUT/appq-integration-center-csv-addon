var $bugsListContainer;
var $availableFieldsContainer;
var $saveCSVExport;
var $integrationCenterButtons = {
    sendSingle: null
};
var $bugTracker;

var bugIDs = [];
var inspectionIDs = [];
var sendClicked = false;
var bugCollectorInterval = false;

jQuery( document ).ready( function() {
    // Cache Containers
    $bugsListContainer = jQuery( "#bugs_list" );
    $availableFieldsContainer = jQuery( "#available-fields" );
    $saveCSVExport = jQuery( "#save-csv-export" );
    $integrationCenterButtons.sendAll = $bugsListContainer.find( ".send-all" );
    $integrationCenterButtons.sendSelected = $bugsListContainer.find( ".send-selected" );
    $integrationCenterButtons.sendSingle = $bugsListContainer.find( "table" );
    $bugTracker = jQuery( "#general_settings [name='bugtracker']" );

    // Init Methods
    $availableFieldsContainer.on( "click", "span", clickAvailableField );
    $saveCSVExport.on( "click", clickSaveCSVExport );
    $integrationCenterButtons.sendSingle.on( "click", ".upload_bug", { type: "sendSingle" }, clickSend );
} );