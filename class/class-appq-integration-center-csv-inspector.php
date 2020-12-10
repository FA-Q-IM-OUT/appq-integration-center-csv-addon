<?php

class CsvInspector
{
	private $_CAMPAIGN_ID;

	public function __construct( $cp_id )
	{
		$this->_CAMPAIGN_ID = $cp_id;
	}

	public function has_bugs( $cp_id = 0 ) {
		// Check if CP ID is set as an Integer
		$cp_id = intval( $cp_id );
		
		// If the CP ID is not provided collect it from the original init
		if ( $cp_id == 0 ) { $cp_id = $this->_CAMPAIGN_ID; }

		// Init Table
		global $wpdb;
		$appq_evd_bug = $wpdb->prefix ."appq_evd_bug";
		
		// Collect at least 1 result from the Table for the given Campaign in order to determine if the campaign has Bugs
		$results_ = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM $appq_evd_bug WHERE campaign_id=%d LIMIT 1",
				array( $cp_id )
			),
			OBJECT
		);

		// Return result based on the campaign
		return !empty( $results_ ) ? true : false;
	}
}
