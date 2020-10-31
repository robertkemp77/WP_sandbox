<?php

/**
 * Register all actions and filters for the plugin
 *
 * @link       https://RewardsFuel.com
 * @since      2.0.44
 *
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/includes
 */

/**
 * Admin pages methods
 *
 *
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/includes
 * @author     Rewards Fuel LLC <info@rewardsfuel.com>
 */
class Contests_From_Rewards_Fuel_Admin extends Class_rf
{
    /**
     * The array of actions registered with WordPress.
     *
     * @since    2.0.44
     * @access   protected
     * @var      array $actions The actions registered with WordPress to fire when the plugin loads.
     */


    public function __construct()
    {
    	parent::__construct();
	    add_action('admin_init', array('Contests_From_Rewards_Fuel_Admin','welcome_redirect'));
	    add_action( 'admin_menu', array('Contests_From_Rewards_Fuel_Admin','rewards_fuel_plugin_menu'));
	    add_action('admin_init', array('Contests_From_Rewards_Fuel_Admin','ajax_handler'));
	    add_action('admin_init', array('Contests_From_Rewards_Fuel_Admin','blocks_editor'));
	    add_action("add_meta_boxes", array("Contests_From_Rewards_Fuel_Admin","legacy_box"));
    }


	public function enqueue_styles() {
		wp_enqueue_style( 'contests-from-rewards-fuel', CONTESTS_FROM_REWARDS_FUEL_BASE_URL. 'admin/css/contests-from-rewards-fuel-admin.css', array(),'2', 'all' );
		wp_enqueue_style( 'contests-from-rewards-fuel-dependencies', CONTESTS_FROM_REWARDS_FUEL_BASE_URL. 'admin/css/dependencies.css', array(),'2', 'all' );
	}
	public function enqueue_scripts() {
		wp_enqueue_script( 'contests-from-rewards-fuel-dependencies-popper', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js', array( ),'2', false );
		wp_enqueue_script( 'contests-from-rewards-fuel-dependencies', CONTESTS_FROM_REWARDS_FUEL_BASE_URL . 'admin/js/dependencies.js', array( ),'2', false );
		wp_enqueue_script( 'contests-from-rewards-fuel', CONTESTS_FROM_REWARDS_FUEL_BASE_URL . 'admin/js/contests-from-rewards-fuel-admin.js',array(), '2', true );

	}

    //added on activation hook
	public static function ajax_handler(){
		if (!defined('DOING_AJAX'))
			return false;
		try {
			$capability = "edit_posts";
			if (current_user_can($capability)) {
				if (isset($_REQUEST["get_contests"])) {
					Contests_From_Rewards_Fuel_Admin::get_contests();
				}
				if (isset($_REQUEST["update_rewards_fuel_api_key"])) {
					update_option("rewards_fuel_api_key", $_REQUEST["update_rewards_fuel_api_key"]);
					wp_die();
				}
				if (isset($_REQUEST["get_upgrade"])) {
					include CONTESTS_FROM_REWARDS_FUEL_FILE_ROOT . 'admin/views/upgrade.php';
					wp_die();
				}
			}

		} catch (Exception  $e) {
			$rf = new Rewards_Fuel();
			$rf->exc_handler($e);
		}
	}

	private static function get_contests(){
		$rf = new Contests_From_Rewards_Fuel();
		$data = array(
			'key'=>$rf->get_key()
		);
		$result = $rf->rf_exe("get_contests",$data);
		wp_send_json($result);
	}
	///added on admin_init
	public static function rewards_fuel_plugin_menu()
	{

		$encoded_icon = '  PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSI0OTAgNDkwIDIwIDIwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDQ5MCA0OTAgMjAgMjAiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGcgaWQ9IkxheWVyXzFfMV8iPg0KCTxwYXRoIGZpbGw9IiMwM0FGRkYiIGQ9Ik01MDAsNDkwLjQxNmMwLDAtNi4yMjgsNy43MjEtNi4yMjgsMTIuNTFjMCw4Ljg3OCwxMi40NTUsOC44NzgsMTIuNDU1LDANCgkJQzUwNi4yMjgsNDk4LjEzNyw1MDAsNDkwLjQxNiw1MDAsNDkwLjQxNnogTTQ5OC4xOTgsNTA2LjUwNGMtMC4xMzgsMC4xOTQtMC4zNTQsMC4zLTAuNTY5LDAuM2MtMC4xMzMsMC0wLjI2OS0wLjA0LTAuMzg3LTAuMTIxDQoJCWMtMS4yNTktMC44NjYtMS43OTYtMi4zMDEtMS43OTItMy43MjVjMC0xLjE1OSwwLjMzNy0yLjM1MSwwLjk1LTMuMzg3YzAuMTk0LTAuMzI0LDAuNjE1LTAuNDM0LDAuOTM4LTAuMjM5DQoJCWMwLjMyNiwwLjE5NSwwLjQzNCwwLjYxMiwwLjI0MywwLjkzOWMtMC40OTIsMC44MjItMC43NiwxLjc5OC0wLjc1OSwyLjY4N2MwLjAwMywxLjExMSwwLjM5MywyLjAzOCwxLjE5NywyLjU5Mw0KCQlDNDk4LjMzLDUwNS43NjcsNDk4LjQxLDUwNi4xOTMsNDk4LjE5OCw1MDYuNTA0eiIvPg0KPC9nPg0KPC9zdmc+DQo=';
		$rf_svg = 'data:image/svg+xml;base64,' .$encoded_icon; // base 64 string goes here

		add_menu_page(
			'Rewards Fuel',
			'Rewards Fuel',
			'manage_options',
			'rewards_fuel_contests',
			array('Contests_From_Rewards_Fuel_Admin','rewards_fuel_dashboard_page'),
			$rf_svg ,
			100
		);
		//each menu item

		add_submenu_page(
			'rewards_fuel_contests',
			__("Contest editor", 'contests-from-rewards-fuel'),
			__("Contest editor", 'contests-from-rewards-fuel'),
			'manage_options',
			'rewards_fuel_contest_editor',
			array('Contests_From_Rewards_Fuel_Admin','contest_editor')
		);
		add_submenu_page(
			'rewards_fuel_contests',
			__("Your account", 'contests-from-rewards-fuel'),
			__("Your account", 'contests-from-rewards-fuel'),
			'manage_options',
			'rewards_fuel_account',
			array('Contests_From_Rewards_Fuel_Admin','account_page')
		);

	}
	//added on admin_init
	public static function blocks_editor(){
		function rf_gutenberg_contests_backend(){
			wp_enqueue_script(
				'rf-contest-block-editor',
				plugins_url('contests-from-rewards-fuel/admin/js/contest_editor_block.js'),
				array('wp-blocks', 'wp-element')
			);

			wp_enqueue_style(
				'rf-contest-block-editor',
				plugins_url('contests-from-rewards-fuel/admin/css/contest_editor_block.css'),
				array()
			);
		}
		add_action('enqueue_block_editor_assets', 'rf_gutenberg_contests_backend');
		//function rf_gutenberg_contests_frontend()
		{
			//nothing to do here
		}
		//add_action('wp_enqueue_scripts', 'rf_gutenberg_contests_frontend');
	}


	public static function rewards_fuel_dashboard_page()
	{
		try {
			if ( ! current_user_can( 'manage_options' ) )
				wp_die( __( 'You do not have sufficient permissions to access this page.' ) );

			wp_enqueue_script( 'contests-from-rewards-fuel-dependencies-bs-table', CONTESTS_FROM_REWARDS_FUEL_BASE_URL . 'admin/js/bootstrap-table.min.js', array( ),'2', false );
			$rf = new Contests_From_Rewards_Fuel();
			$rfa = new Contests_From_Rewards_Fuel_Admin();
			$rfa->enqueue_scripts();
			$rfa->enqueue_styles();
			$rf_key =  $rf->get_key();
			include  CONTESTS_FROM_REWARDS_FUEL_FILE_ROOT.'admin/views/dashboard.php';

		}catch (Exception $e){
			$rf = new Contests_From_Rewards_Fuel();
			$rf->exc_handler($e);
		}
	}
	public function dashboard(){
		try {
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
			}
			$this->enqueue_scripts();
			$this->enqueue_styles();
			if ( ! class_exists( 'WP_List_Table' ) ) {
				require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
			}



		}catch (Exception $e){
			//var_dump($e);
		}
	}

	public static function contest_editor(){
		try {
			if ( ! current_user_can( 'manage_options' ) )
				wp_die( __( 'You do not have sufficient permissions to access this page.' ) );

			$rf = new Contests_From_Rewards_Fuel();
			$rfa = new Contests_From_Rewards_Fuel_Admin();
			$rfa->enqueue_scripts();
			$rfa->enqueue_styles();
			$rf_key =  $rf->get_key();

			include CONTESTS_FROM_REWARDS_FUEL_FILE_ROOT.'admin/views/contest_editor.php';
			include CONTESTS_FROM_REWARDS_FUEL_FILE_ROOT.'admin/views/welcome.php';
		}catch (Exception $e){
			$rf = new Contests_From_Rewards_Fuel();
			$rf->exc_handler($e);
		}
	}
	public static function account_page(){
		try {
			if ( ! current_user_can( 'manage_options' ) )
				wp_die( __( 'You do not have sufficient permissions to access this page.' ) );

			$rf = new Contests_From_Rewards_Fuel();
			$rfa = new Contests_From_Rewards_Fuel_Admin();
			$rfa->enqueue_scripts();
			$rfa->enqueue_styles();
			$rf_key =  $rf->get_key();
			if (strpos($rf_key, 'SK') !== false) {
				include CONTESTS_FROM_REWARDS_FUEL_FILE_ROOT . 'admin/views/account_page.php';
			}else{
				include CONTESTS_FROM_REWARDS_FUEL_FILE_ROOT . 'admin/views/account_page_logged_in.php';
			}

		}catch (Exception $e){
			$rf = new Contests_From_Rewards_Fuel();
			$rf->exc_handler($e);
		}
	}

	public static function legacy_box()
	{
		function print_box(){
			$rf = new Contests_From_Rewards_Fuel();
			$rf_key =  $rf->get_key();
			include CONTESTS_FROM_REWARDS_FUEL_FILE_ROOT.'admin/views/legacy_box.php';
		}
		add_meta_box("rf-legacy-meta-box", "Contests",'print_box', "post", "side", "default", null);
		return;

	}
	public static function welcome_redirect()
	{
		try {
			if ( is_network_admin() || isset( $_GET['activate-multi'] ) ) {
				return;
			}
			if ( ! get_transient( 'rewards_fuel_welcome' ) ) {
				return;
			}
			delete_transient( 'rewards_fuel_welcome' );
			wp_safe_redirect( add_query_arg( array( 'page' => 'rewards_fuel_contest_editor#welcome' ), admin_url( 'admin.php' ) ) );
		}catch (Exception $e){
			$rf = new Contests_From_Rewards_Fuel();
			$rf->exc_handler($e);
		}
	}

}
