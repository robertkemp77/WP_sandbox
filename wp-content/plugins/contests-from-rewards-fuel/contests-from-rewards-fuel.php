<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://RewardsFuel.com
 * @since             2.0.44
 * @package           Contests_From_Rewards_Fuel
 *
 * @wordpress-plugin
 * Plugin Name:       Contests by Rewards Fuel
 * Plugin URI:        https://RewardsFuel.com
 * Description:       Run contests which add incentive for subscribing and more
 * Version:           2.0.44
 * Author:            Rewards Fuel LLC
 * Author URI:        https://RewardsFuel.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       contests-from-rewards-fuel
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}
require plugin_dir_path( __FILE__ ) . 'includes/Class_rf.php';
/**
 * Currently plugin version.
 * Start at version 2.0.44 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'CONTESTS_FROM_REWARDS_FUEL_VERSION', '2.0.44' );
define( 'CONTESTS_FROM_REWARDS_FUEL_BASE_URL', plugin_dir_url(__FILE__) );
define( 'CONTESTS_FROM_REWARDS_FUEL_FILE_ROOT',  plugin_dir_path( __FILE__ ) );
/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-contests-from-rewards-fuel-activator.php
 */
function activate_contests_from_rewards_fuel() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-contests-from-rewards-fuel-activator.php';
	Contests_From_Rewards_Fuel_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-contests-from-rewards-fuel-deactivator.php
 */
function deactivate_contests_from_rewards_fuel() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-contests-from-rewards-fuel-deactivator.php';
	Contests_From_Rewards_Fuel_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_contests_from_rewards_fuel' );
register_deactivation_hook( __FILE__, 'deactivate_contests_from_rewards_fuel' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */

require plugin_dir_path( __FILE__ ) . 'includes/class-contests-from-rewards-fuel.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    2.0.44
 */
function run_contests_from_rewards_fuel() {

	$plugin = new Contests_From_Rewards_Fuel();
	$plugin->run();

}
run_contests_from_rewards_fuel();
