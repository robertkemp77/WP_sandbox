<script>
    var rf_api_url = 'https://app.rewardsfuel.com/api/Wp_v2/';
    var rf_wp_key = '<?php echo $rf_key; ?>';
    var site_url = '<?php echo get_site_url() ?>';
    var rf_admin_location = "account";
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.3.2/bootbox.min.js" integrity="sha256-s87nschhfp/x1/4+QUtIa99el2ot5IMQLrumROuHZbc=" crossorigin="anonymous"></script>
<div class="container text-center">
<div class="rf-contests-page">
	<div class="top-area-accounts mb-5 text-left">
		<img src="//cdn.rewardsfuel.com/assets/images/rf_animated_logo.svg" width="50" height="50"> Your account
	</div>
		<div class="row">
		<div class="col-md-7">
			<div class="p-4 border-rf text-left">
			<h4>You're signed in</h4>
			<div class="rf-settings-row">Hello <span class="contest_holder_name"></span></div>
			<a  class="btn btn-primary" href="https://app.rewardsfuel.com/account/?wpkey= <?php echo  $rf_key; ?>">Edit account</a>
			<a  class="btn btn-primary btn-upgrade d-none" href="https://accounts.rewardsfuel.com/plans/?wpkey= <?php echo  $rf_key; ?>">Plan: <span class="plan_name"></span>  -> upgrade ></a>
			<a href="#" class="disconnect-key mt-5">Disconnect account from WordPress</a>
			</div>
		</div>
		<div class="col-md-5">
			<div class=" p-4 border-rf">
			<form id="account_live_help">
				<h5>Have questions?</h5>
			<textarea class="rf-text-area" name="message" placeholder="Have questions?" required></textarea>
			<button type="submit" class="btn btn-primary btn-block mb-4">Ask</button>
			</form>
			</div>
		</div>
		</div>

	<div class="account-footer-links">
	<a href="https://rewardsfuel.com/privacy" target="_blank">Privacy policy</a>
	<a href="https://rewardsfuel.com/" target="_blank">About us</a>
	<a href="https://rewardsfuel.com/privacy" class="delete-account" target="_blank">Delete account</a>
	</div>
</div>
</div>
<script src="https://app.rewardsfuel.com/assets/js/boostrap/bootstrap.min.js"></script>
<link rel="stylesheet" href="https://app.rewardsfuel.com/assets/css/bootstrap/bootstrap.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css"
      integrity="sha256-+N4/V/SbAFiW1MPBCXnfnP9QSN3+Keu+NlB+0ev/YKQ=" crossorigin="anonymous"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.2/alertify.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.2/css/alertify.min.css"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css"
      integrity="sha256-PHcOkPmOshsMBC+vtJdVr5Mwb7r0LkSVJPlPrp/IMpU=" crossorigin="anonymous"/>
<script>
	jQuery(document).ready(function(){
        rf_admin.get_ch_data();
    })
</script>
