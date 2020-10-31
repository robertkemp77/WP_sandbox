<?php

/**
 * Fired during plugin deactivation
 *
 * @link       https://RewardsFuel.com
 * @since      2.0.44
 *
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      2.0.44
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/includes
 * @author     Rewards Fuel LLC <info@rewardsfuel.com>
 */
class Contests_From_Rewards_Fuel_Deactivator extends Class_rf {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    2.0.44
	 */
	public static function deactivate() {
	    $rf = new Class_rf();
	    $rf->__construct();
		$de = new Contests_From_Rewards_Fuel_Deactivator();
		$de->log_deactivation();
	}
	private function log_deactivation(){
		try {
			$rf = new Contests_From_Rewards_Fuel();
			$current_user = wp_get_current_user();
			$data = array(
				'action' => 'deactivated',
				'url' => get_site_url(),
				'api_key' => $rf->get_key(),
				'first_name'=>$current_user->user_firstname,
				'last_name' => $current_user->user_lastname,
				'email' => $current_user->user_email
			);
			$rf->rf_exe("deactivated",$data);
		} catch (Exception $e) {
			$rf->exc_handler($e);
		}
	}
}
