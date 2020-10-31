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
class Contests_From_Rewards_Fuel_Entry_Methods extends Class_rf {
	protected $rf;

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
		$this->rf =  new Contests_From_Rewards_Fuel();
	}

	//handler for new approved (set in activation)
	public function rf_approve_comment_callback($new_status, $old_status, $comment)
	{
		try {
			$post_id = $comment->comment_post_ID;
			$entry_method_id = $this->get_post_entry_method_id($post_id);
			$api_key = $this->get_post_entry_method_key($post_id);
			if ($entry_method_id > 0) {
				$comment_data = array(
					'entry_method_id' => $entry_method_id,
					'api_key' => $api_key,
					'comment_id' => $comment->comment_ID,
					'comment_post_id' => $post_id,
					'comment_status' => $new_status,
					'comment_author' => $comment->comment_author,
					'comment_author_email' => $comment->comment_author_email,
					'comment_author_url' => $comment->comment_author_url,
					'comment_author_IP' => $comment->comment_author_IP,
					'comment_date_gmt' => $comment->comment_date_gmt,
					'comment_karma' => $comment->comment_karma,
					'comment_agent' => $comment->comment_agent,
					'comment_content' => $comment->comment_content
				);
				if ($new_status == 'approved') {
					$this->add_comment_entry($comment_data);
				}
				if ($new_status == 'unapproved') {
					$this->remove_comment_entry($comment_data);
				}
			}
		} catch (Exception $e) {
			$this->rf->exception_handler($e);
		}
	}

	//handler for new comments (set in activation)
	public function rf_new_comment_callback($comment_id)
	{
		try {

			$comment = get_comment($comment_id);
			$post_id = $comment->comment_post_ID;
			$entry_method_id = $this->get_post_entry_method_id($post_id);
			$api_key = $this->get_post_entry_method_key($post_id);
			if ($entry_method_id > 0) {
				if ((bool)$comment->comment_approved) {
					$new_status = 'approved';
				} else {
					$new_status = 'unapproved';
				}
				$comment_data = array(
					'entry_method_id' => $entry_method_id,
					'api_key' => $api_key,
					'comment_id' => $comment->comment_ID,
					'comment_post_id' => $post_id,
					'comment_status' => $new_status,
					'comment_author' => $comment->comment_author,
					'comment_author_email' => $comment->comment_author_email,
					'comment_author_url' => $comment->comment_author_url,
					'comment_author_IP' => $comment->comment_author_IP,
					'comment_date_gmt' => $comment->comment_date_gmt,
					'comment_karma' => $comment->comment_karma,
					'comment_agent' => $comment->comment_agent,
					'comment_content' => $comment->comment_content
				);
				if ($new_status == 'approved') {
					$this->add_comment_entry($comment_data);
				}
				if ($new_status == 'unapproved') {
					$this->remove_comment_entry($comment_data);
				}
			}
		} catch (Exception $e) {
			$this->rf->exception_handler($e);
		}
	}

	private function get_post_entry_method_id($post_id)
	{
		try {
			$key = 'rf_e';
			$the_meta = get_post_meta($post_id, $key, TRUE);
			if ($the_meta != '') {
				return $the_meta;
			} else {
				return 0;
			}
		} catch (Exception $e) {
			$this->rf->exception_handler($e);
		}
	}
	private function get_post_entry_method_key($post_id)
	{
		try {
			$key = 'rf_a';
			$the_meta = get_post_meta($post_id, $key, TRUE);
			if ($the_meta != '') {
				return $the_meta;
			} else {
				return 0;
			}
		} catch (Exception $e) {
			$this->rf->exception_handler($e);
		}
	}
	private function add_comment_entry($arg_array)
	{
		try {
			$this->rf->rf_exe("wp_comment_entry",$arg_array);
		} catch (Exception $e) {
			$this->rf->exception_handler($e);
		}
	}
	private function remove_comment_entry($arg_array)
	{

		try {
			$this->rf->rf_exe("wp_remove_comment_entry",$arg_array);
		} catch (Exception $e) {
			$this->rf->exception_handler($e);
		}

	}



}
