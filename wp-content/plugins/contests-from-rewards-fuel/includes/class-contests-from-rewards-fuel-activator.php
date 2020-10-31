<?php

/**
 * Fired during plugin activation
 *
 * @link       https://RewardsFuel.com
 * @since      2.0.44
 *
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      2.0.44
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/includes
 * @author     Rewards Fuel LLC <info@rewardsfuel.com>
 */
class Contests_From_Rewards_Fuel_Activator extends Class_rf {

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    2.0.44
	 */
	public function __construct() {
		parent::__construct();
	}

	public function activate() {
		//see if already installed if not register free account
		$rf           = new Contests_From_Rewards_Fuel();
		$existing_key = $rf->get_key();
		if ( $existing_key == false ) {
			$rf->create_key();
		}
		if ( function_exists( 'register_block_type' ) ) {
			$rfa = new Contests_From_Rewards_Fuel_Admin();
			$rfa->blocks_editor();
		}
		add_action( 'admin_menu', array( 'Contests_From_Rewards_Fuel_Admin', 'rewards_fuel_plugin_menu' ) );
		$act = new Contests_From_Rewards_Fuel_Activator();
		$act->activation_hooks();
		$act->log_activation();
		// Redirect to our page
		set_transient( 'rewards_fuel_welcome', true, 30 );


	}

	private function log_activation() {
		try {
			$current_user = wp_get_current_user();
			$rf           = new Contests_From_Rewards_Fuel();
			$arg_array    = array(
				'action'     => 'activated',
				'url'        => get_site_url(),
				'first_name' => $current_user->user_firstname,
				'last_name'  => $current_user->user_lastname,
				'email'      => $current_user->user_email,
				'api_key'    => $rf->get_key(),

			);
			$rf->rf_exe( "activation", $arg_array );
		} catch ( Exception $e ) {
			$rf->exc_handler( $e );
		}
	}

	private function activation_hooks() {
		$actions = array(
			array(
				'hook'          => 'transition_comment_status',
				'component'     => 'class-contests-from-rewards-fuel-entry-methods',
				'callback'      => 'rf_approve_comment_callback',
				'priority'      => 10,
				'accepted_args' => 3
			),
			array(
				'hook'          => 'comment_post',
				'component'     => 'class-contests-from-rewards-fuel-entry-methods',
				'callback'      => 'rf_new_comment_callback',
				'priority'      => 10,
				'accepted_args' => 1
			),
			array(
				'hook' => 'add_meta_boxes',
				'component' => 'class-contests-from-rewards-fuel-admin',
				'callback'  => 'rf_add_widget',
				'priority'      => 10,
				'accepted_args' => false
			),
			array(
				'hook' => 'wp_ajax_ajax_handler',
				'component' => 'class-contests-from-rewards-fuel-admin',
				'callback'  => 'rf_ajax_handler',
				'priority'      => 10,
				'accepted_args' => false
			)

		);
		foreach ( $actions as $hook ) {

			add_action( $hook['hook'], array(
				$hook['component'],
				$hook['callback']
			), $hook['priority'], $hook['accepted_args'] );
			//var_dump($hook['hook']);
		}
	}

}
