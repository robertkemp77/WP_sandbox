<?php


class Class_rf {
	private $debug = false;
	private $api_home;
	public function __construct() {
		if ( defined( 'CONTESTS_FROM_REWARDS_FUEL_VERSION' ) ) {
			$this->version = CONTESTS_FROM_REWARDS_FUEL_VERSION;
		} else {
			$this->version = '2.0.44';
		}
		$this->api_home ="https://app.rewardsfuel.com/api/wp_v2/";//todo update this to sub url
		set_exception_handler(array('self', 'exc_handler'));
		set_error_handler(array('self', 'err_handler'));
	}

	public function err_handler($errno, $errstr, $errfile, $errline)
	{
		try {
			$er_obj           = new stdClass();
			$er_obj->number   = $errno;
			$er_obj->desc     = $errstr;
			$er_obj->file     = $errfile;
			$er_obj->line_nbr = $errline;
			$er_obj->account     = get_option('rewards_fuel_api_key', false);
			$er_obj->get      = $_GET;
			$er_obj->post     = $_POST;
			$er_obj->url      = ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ? "https" : "http" ) . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
			$result = $this->rf_exe( "log", $er_obj, $decode = false );
			if($this->debug)
				var_dump($er_obj,$result);

		}catch (Exception $e){
			if($this->debug)
				var_dump($e);
		}
	}
	public function exc_handler($exception)
	{
		try {
			$er_obj = new stdClass();
			$er_obj->exception = $exception->getMessage();
			$er_obj->account     = get_option('rewards_fuel_api_key', false);
			$er_obj->get      = $_GET;
			$er_obj->post     = $_POST;
			$er_obj->url =  (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
			$result = $this->rf_exe( "log", $er_obj, $decode = false );
			//if($this->debug)
				//var_dump($er_obj,$result);
		}catch (Exception $e){
			if($this->debug)
				var_dump($e);
		}
	}
	public function rf_exe($method,$data=false,$decode = true){
		$url = false;
		if($method =="log"){
			$url = "log";
		}
		if($method =="create_key"){
			$url = "create_key";
		}
		if($method =="wp_comment_entry"){
			$url = "wp_comment_entry";
		}
		if($method =="wp_remove_comment_entry"){
			$url = "wp_remove_comment_entry";
		}
		if($method =="activation"){
			$url = "activation";
		}
		if($method =="deactivated"){
			$url = "deactivated";
		}
		if($method =="get_contests"){
			$url = "get_contests";
		}
		if($url != false)
			$url = $this->api_home.$url;
		else {
			//todo add debug parameter
			$url = "missed";
			$data = array("missed method",$method,"params"=>$data);
			//var_dump("MISSSED RFEXE $method");
			//return;
		}
		$post_data = false;
		if($data != false){
			$post_data = http_build_query($data);
		}
		try {
			if (in_array('curl', get_loaded_extensions())) {
				$handle = curl_init($url);
				curl_setopt($handle, CURLOPT_SSL_VERIFYHOST, 0);
				curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, 0);
				curl_setopt($handle, CURLOPT_RETURNTRANSFER, 1);
				if($post_data !=false) {
					curl_setopt($handle, CURLOPT_POST, count($data));
					curl_setopt($handle, CURLOPT_POSTFIELDS, $post_data);
				}
				$response = curl_exec($handle);

				if($this->debug) {
					var_dump( $response,curl_getinfo ($handle)  );
				}
				curl_close($handle);
				if($decode)
					return json_decode($response);
				return $response;
			} else {
				$context = null;
				if($post_data != false) {
					$opts = array('http' =>
						              array(
							              'method' => 'POST',
							              'header' => 'Content-Type: application/x-www-form-urlencoded',
							              'content' => $post_data
						              )
					);
					$context  = stream_context_create($opts);
				}
				$response = file_get_contents($url, false, $context);
				if($this->debug)
					var_dump($response);
				if($decode)
					return json_decode($response);
				return $response;
			}
		} catch (Exception $e) {
			try {
				mail('info@rewardsfuel.com', 'wp-error on curl function', 'Curl error ' . json_encode($e));
			} catch (Exception $f) {
				//var_dump($f);
			}
		}
	}


}
