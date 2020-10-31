<link rel=stylesheet href="https://cdn.rewardsfuel.com/assets/css/rf-font/css/rewardsfuel.css" media="none"
      onload="if(media!='all')media='all'">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.6/quill.snow.min.css" media="none" onload="if(media!='all')media='all'"/>
<link href="https://cdn.jsdelivr.net/npm/select2@4.0.12/dist/css/select2.min.css" media="none" onload="if(media!='all')media='all'" rel="stylesheet" />
<script src="//cdn.quilljs.com/1.3.6/quill.js"></script>
<script>
    var rf_wp_key = ' <?php echo  $rf_key?>';
    var rf_loading_ing = "<div class='loader-container'><img src='https://cdn.rewardsfuel.com/assets/images/wl_loader.svg'></div>";
    var rf_api_url = 'https://app.rewardsfuel.com/api/Wp_v2/';
    var site_url = ' <?php echo get_site_url() ?>';
    var rf_admin_location = "contest";
</script>


<div id="rf-loader"  class="rf-loader">
	<img src="https://cdn.rewardsfuel.com/assets/images/wl_loader.svg">
</div>
<div class="rf-contests-page">
	<!--Navbar -->
	<nav class="mb-2 navbar navbar-expand-lg w-100">
		<a class="navbar-brand" href="#"><img src="//cdn.rewardsfuel.com/assets/images/rf_animated_logo.svg" width="50" height="50" class="contest-menu-drop mr-4"></a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#rf-contest-nav"
		        aria-controls="rf-contest-nav" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="rf-contest-nav">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item active">
					<button class="nav-link active contest-nav" data-target="styler">Style <span
							class="dashicons dashicons-admin-appearance"></span></button>
				</li>
				<li class="nav-item">
					<button class="nav-link  contest-nav" data-target="embeds">Add to post<span
							class="dashicons dashicons-align-center"></span></button>
				</li>
				<li class="nav-item">
					<button class="nav-link contest-nav" data-target="prizes">Prizes <span
							class="dashicons dashicons-awards"></span></button>
				</li>
				<li class="nav-item">
					<button class="nav-link contest-nav" data-target="settings">Settings <span
							class="dashicons dashicons-admin-generic"></span></button>
				</li>
				<li class="nav-item no-border-right">
					<button class="nav-link create-new-rf-contest">Create new contest</button>
				</li>
			</ul>
			<ul class="navbar-nav ml-auto nav-flex-icons">
				<li class="nav-item no-border-right">
				<select id="contest-editor-selector">
					<option>Contest name / swap contest</option>
				</select>
				</li>
			</ul>
		</div>
	</nav>
	<div id="rf-contest-body-styler" class="rf-contest-editor-body">
		<iframe src="https://app.rewardsfuel.com/assets/images/loader.svg"
		        scrolling="no" id="contest-editor-frame"></iframe>
		<p><a href="#" class="contest-hand">Want a hand creating your contest?</a></p>
	</div>
	<div class="container-fluid pt-4">
	<div class="row" id="rf-contest-settings-area">
		<div class="col-md-4"><!--all navs -->
			<div id="nav-rf-contest-styler" class="contest-editor-nav d-none">
				 <?php //include 'editor_views/style_controls.php' ?>
			</div>
			<div id="nav-rf-contest-entry-methods" class="contest-editor-nav">
				 <?php //include 'editor_views/entry_method_controls.php' ?>
			</div>
			<div id="nav-rf-contest-prizes" class="contest-editor-nav">
				 <?php include 'editor_views/prize_controls.php' ?>
			</div>
			<div id="nav-rf-contest-settings" class="contest-editor-nav">
				 <?php include 'editor_views/settings_controls.php' ?>
			</div>

		</div>
		<div class="col-md-8"><!--all content body -->

			<div id="rf-entry-method-form-holder" class="rf-contest-editor-body"></div>
			<div id="rf-contest-body-prizes" class="rf-contest-editor-body">
				<?php
				include 'editor_views/prize_form.php';
				?>
			</div>
			<div id="rf-contest-body-settings" class="rf-contest-editor-body">
				<?php
				include 'editor_views/settings_general.php';
				include 'editor_views/settings_rules.php';
				include 'editor_views/settings_schedule.php';
				include 'editor_views/setting_gdpr.php';
				include 'editor_views/settings_age_geo.php';
				include 'editor_views/settings_email.php';
				?>
			</div>
		</div>
	</div>
	</div>
</div>
<script>
    jQuery(document).ready(function () {
        rf_admin.get_contests(rf_admin.contests_ready);
        rf_admin.init_editor();
    })
</script>

