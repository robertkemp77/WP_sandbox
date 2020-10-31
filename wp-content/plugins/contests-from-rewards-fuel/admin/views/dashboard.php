
<script>
    var rf_wp_key = ' <?php echo  $rf_key?>';
    var rf_loading_ing = "<div class='loader-container'><img src='https://cdn.rewardsfuel.com/assets/images/wl_loader.svg'></div>";
    var rf_api_url = 'https://app.rewardsfuel.com/api/Wp_v2/';
    var site_url = ' <?php echo get_site_url() ?>';
    var rf_admin_location = "dashboard";
</script>
<style>

</style>

<div class="rf-contests-page p-4 container-fluid">
	<nav class="mb-2 navbar navbar-expand-lg pl-0">
		<a class="navbar-brand" href="#"><img src="//cdn.rewardsfuel.com/assets/images/rf_animated_logo.svg"
		                                      class="contest-menu-drop mr-4"></a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#rf-contest-nav"
		        aria-controls="rf-contest-nav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="rf-contest-nav">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item active">
					<button class="nav-link active contest-nav" data-target="styler">Your contests</button>
				</li>
				<li class="nav-item">
					<button class="nav-link  contest-nav create-new-rf-contest">Create new contest</button>
				</li>

				<li class="nav-item">
					<a href="admin.php?page=rewards_fuel_account" class="nav-link">Account</a>
				</li>
				<li class="nav-item">
					<button class="nav-link help-popup">Help</button>
				</li>
				<li class="nav-item no-border-right">
					<a href="https://rewardsfuel.com/pricing" target="_blank" class="nav-link">Upgrade</a>
				</li>
			</ul>

		</div>
	</nav>


		<div id="rf-loader" class="rf-loader">
			<img src="https://cdn.rewardsfuel.com/assets/images/wl_loader.svg">
		</div>
		<div id="rf-dashboard">
			<table id="contest-table" class="table table-light striped d-block w-100">
				<thead>
				<tr>
					<th class="contest_tbl_name" data-sortable="true" data-field="name">Contest</th>
					<th class="contest_tbl_status" data-sortable="true" data-field="status">Status</th>
					<th class="contest_tbl_nbr" data-sortable="true" data-field="contestants">Contestants</th>
					<th class="contest_tbl_nbr" data-sortable="true" data-field="entries">Entries</th>

				</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>


	<script type="text/html" id="embed-area">
		 <?php include 'editor_views/embed_area.php' ?>
	</script>
	<script type="text/html" id="schedule-area">
		 <?php include 'editor_views/settings_schedule.php' ?>
	</script>
	<script type="text/html" id="contestants_report">
		<a href="{url}" target="_blank" id="full-stats-link">Visit full site for more stats</a>
		 <?php include 'editor_views/contestants_report.php' ?>

	</script>
	<script type="text/html" id="rf-help-popup">
		<form id="account_live_help">
			<textarea class="rf-text-area" name="message" placeholder="Have a question?" required></textarea>
			<button type="submit" class="btn btn-primary btn-block">Ask</button>


		</form>
</script>

	<script>

        jQuery(document).ready(function () {
            rf_admin.init_contests_table();
        })
	</script>
