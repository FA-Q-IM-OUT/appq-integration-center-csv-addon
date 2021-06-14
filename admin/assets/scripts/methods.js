function clickAvailableField() {
    let $this = jQuery( this );
    if ( $this.hasClass( "selected" ) ) { $this.removeClass( "selected" ); }
    else { $this.addClass( "selected" ); }
}

function clickSaveCSVExport() {
    // Check if the button is locked
    if ( jQuery( this ).hasClass( "locked" ) ) { return false; }

    // Lock the Button
    jQuery( this ).addClass( "locked" ).attr( "disabled", "disabled" ).find( "i" ).addClass( "fa-spinner" );

    // Collect all of the selected fields
    let fieldKeys = {};
    $availableFieldsContainer.find( ".field" ).each( function() {
        let data = {};
        data['value'] = jQuery( this ).data( "value" );
        data['description'] = jQuery( this ).data( "description" );
        data['key'] = jQuery( this ).data( "key" );
        if (jQuery( this ).hasClass('selected')) {
            data['selected'] = 1;
        } else {
            data['selected'] = 0;
        }
        fieldKeys[jQuery( this ).data( "key" )] = data;
    } );

    let jsonFieldKeys = JSON.stringify(fieldKeys);

    // Perform an AJAX Call
    jQuery.ajax( {
        url: ajaxurl,
        type: "POST",
        data: {
            action: "save_csv_export",
            cp_id: cp_id,
            field_keys: jsonFieldKeys
        },
        success: function( response ) {
            // Unlock the buton
            jQuery( $saveCSVExport ).removeClass( "locked" ).removeAttr( "disabled" ).find( "i" ).removeClass( "fa-spinner" );

            // Parse Result
            if ( typeof response !== "undefined" ) {
                let result = JSON.parse( response );

                if ( result.messages.length > 0 ) {
                    for ( let key in result.messages ) {
                        toastr[ result.messages[ key ].type ]( result.messages[ key ].message );
                    }
                }

                location.reload();
            }
        },
        error: function( response ) {
            console.log( response );
        }
    } );
}

function clickSend( event ) {
    // Check if the Bug Tracker is set to CSV Exporter
    if ( jQuery( "#setup_manually_cp [name='bugtracker']" ).val().trim().toLowerCase() != "csv_exporter" ) { return false; }

    // Get the Bug ID
    let bugID = jQuery( this ).data( "bug-id" );

    // Check if the Bug ID is stored and in case it's not store it in the array
    if ( bugIDs.indexOf( bugID ) == -1 ) { bugIDs.push( bugID ); }

    // Init Checkup interval if needed
    if ( !sendClicked ) {
        sendClicked = true;
        bugCollectorInterval = setInterval( saveCSVExport, 32 );
    }
}

function saveCSVExport() {
    if ( bugIDs.toString() == inspectionIDs.toString() ) { // If bugIDs is equal to inspectionIDs then all of the Single Buttons were clicked and we are ready for the download
        // Reset the Setup
        sendClicked = false;
        clearInterval( bugCollectorInterval );
        
        // Invoke the CSV Download
        jQuery.ajax( {
            url: ajaxurl,
            type: "POST",
            data: {
                action: "download_csv_export",
                cp_id: cp_id,
                bug_ids: bugIDs
            },
            success: function( response ) {
                // Parse Result
                if ( typeof response !== "undefined" ) {
                    let result = JSON.parse( response );

                    // Present Messages
                    if ( result.messages.length > 0 ) {
                        for ( let key in result.messages ) {
                            toastr[ result.messages[ key ].type ]( result.messages[ key ].message );
                        }
                    }

                    // Invoke the Download upon success
                    if ( result.success ) { window.open( result.download_url ); }
                }
            },
            error: function( response ) {
                console.log( response );
            }
        } );

        // Reset the bugIDs and the inspectionIDs
        bugIDs = [];
        inspectionIDs = bugIDs;
    } else { // Equalize the inspectionIDs with the bugIDs and proceed with the syncing
        inspectionIDs = bugIDs;
    }
}