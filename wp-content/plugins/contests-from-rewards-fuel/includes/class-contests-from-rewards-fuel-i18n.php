<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://RewardsFuel.com
 * @since      2.0.44
 *
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      2.0.44
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/includes
 * @author     Rewards Fuel LLC <info@rewardsfuel.com>
 */
class Contests_From_Rewards_Fuel_i18n extends Class_rf {

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    2.0.44
	 */
	public function load_plugin_textdomain() {
		parent::__construct();
		load_plugin_textdomain(
			'contests-from-rewards-fuel',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}
}
