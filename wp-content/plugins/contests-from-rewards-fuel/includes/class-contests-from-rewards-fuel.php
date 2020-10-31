<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://RewardsFuel.com
 * @since      2.0.44
 *
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      2.0.44
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/includes
 * @author     Rewards Fuel LLC <info@rewardsfuel.com>
 */
class Contests_From_Rewards_Fuel extends Class_rf {
	protected $loader,$plugin_name,$version,$key_name;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    2.0.44
	 */
	public function __construct() {
		parent::__construct();
		$this->plugin_name = 'contests-from-rewards-fuel';
		$this->key_name ='rewards_fuel_api_key';
		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();


	}



	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Contests_From_Rewards_Fuel_Loader. Orchestrates the hooks of the plugin.
	 * - Contests_From_Rewards_Fuel_i18n. Defines internationalization functionality.
	 * - Contests_From_Rewards_Fuel_Admin. Defines all hooks for the admin area.
	 * - Contests_From_Rewards_Fuel_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    2.0.44
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-contests-from-rewards-fuel-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-contests-from-rewards-fuel-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-contests-from-rewards-fuel-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-contests-from-rewards-fuel-public.php';
		/**entry method related actions */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-contests-from-rewards-fuel-entry-methods.php';

		$this->loader = new Contests_From_Rewards_Fuel_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Contests_From_Rewards_Fuel_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    2.0.44
	 * @access   private
	 */
	private function set_locale() {
		$plugin_i18n = new Contests_From_Rewards_Fuel_i18n();
		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    2.0.44
	 * @access   private
	 */
	private function define_admin_hooks() {
		$plugin_admin = new Contests_From_Rewards_Fuel_Admin( $this->get_plugin_name(), $this->get_version() );
		//$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		//$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    2.0.44
	 * @access   private
	 */
	private function define_public_hooks() {
		$plugin_public = new Contests_From_Rewards_Fuel_Public( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    2.0.44
	 */
	public function run() {
		$this->loader->run();
	}
	public function get_plugin_name() {
		return $this->plugin_name;
	}
	public function get_loader() {
		return $this->loader;
	}
	public function get_version() {
		return $this->version;
	}




	public function get_key()
	{
		try {
			return get_option($this->key_name, false);
		} catch (Exception $e) {
			$this->exception_handler($e);
		}
		return false;
	}
	public function create_key(){
		try {
			$current_user = wp_get_current_user();
			$data = array(
				'url' => get_site_url(),
				'first_name' => $current_user->user_firstname,
				'last_name' => $current_user->user_lastname,
				'email' => $current_user->user_email,
				'testing'=>'yes'
			);
			$new_key = $this->rf_exe("create_key", $data);
			$this->save_key($new_key);
			return $new_key;
		} catch (Exception $e) {
			$this->exception_handler($e);
		}
		return false;
	}


	private function save_key($api_key) {
		try {
			if (update_option($this->key_name, $api_key)) {
				//echo("success");
			} else {
				$this->error_log("failed in registering api key", array('api_key' => $api_key));
				//echo("failure");
			}
		} catch (Exception $e) {
			$this->exception_handler($e);
		}
	}





}
