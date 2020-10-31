
<script>
    var rf_api_url = 'https://app.rewardsfuel.com/api/wp_v2/';
    var rf_wp_key = '<?php echo $rf_key; ?>';
    var site_url = '<?php echo get_site_url(); ?>';
    var rf_admin_location = "account";
</script>
<div class="container">
<div class="rf-contests-page">
	<div class="top-area-accounts text-left">
		<img src="//cdn.rewardsfuel.com/assets/images/rf_animated_logo.svg" width="50" height="50"> Your account
	</div>
	<div class="into-para-signed-out">
		You're using Rewards Fuel without an account; to see your full contest statistics, modify previous contests and access full features, please sign up or sign in.
	</div>

		<div class="row">
		<div class="col-md-7">
			<?php include 'account_sign_in.php'?>
		</div>
		<div class="col-md-5 rf-account-second-column">

			<form id="account_live_help">
			<textarea class="rf-text-area" name="message" placeholder="Have a question?" required></textarea>
				<button type="submit" class="btn btn-primary btn-block">Ask</button>


			</form>
			<h4 class="text-center">Connect</h4>
			<div class="rf-socials">
				<a href="https://twitter.com/rewardsfuel" class="btn-social" target="_blank"><i class="fab fa-twitter"></i></a>
				<a href="https://facebook.com/rewardsfuel" class="btn-social" target="_blank"><i class="fab fa-facebook"></i></a>
				<a href="https://rewardsfuel.info" class="btn-social" target="_blank"><i class="fab fa-wordpress"></i></a>
			</div>
			<a href="https://rewardsfuel.com/pricing" target="_blank" class=" btn-primary btn mt-2 mb-2 btn-block">Upgrade now</a>


		</div>
		</div>

	<div class="account-footer-links">
	<a href="https://rewardsfuel.com/privacy" target="_blank">Privacy policy</a>
	<a href="https://rewardsfuel.com/" target="_blank">About us</a>
	<a href="https://rewardsfuel.com/privacy" class="delete-account" target="_blank">Delete account</a>
	</div>
</div>
</div>

