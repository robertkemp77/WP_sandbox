<div class="rf-loader prize-loader hidden"><img src='https://cdn.rewardsfuel.com/assets/images/wl_loader.svg'></div>
<form class="rf-prize-form ">
	<div class="row prize-form-row">
		<div class="col-8 text-left">
			<h2 class="rf-prize-title">Add Prize</h2>
		</div>
		<div class="col-4 text-right">
			<button type="button" class="btn btn-danger rf-delete-prize" data-id="0">Delete prize
			</button>
		</div>
	</div>

	<div class="row prize-form-row">
		<div class="col-sm-8">
			<input type="text" name="prize_name" placeholder="Your prize's name" required>
		</div>
		<div class="col-sm-4 text-right">
			<select class="rf-select" name="prize_type">
				<option selected value="physical">Physical prize</option>
				<option value="digital">Digital / downloadable</option>
			</select>
		</div>
	</div>
	<div class="container">
	<div class="row prize-form-row digital-prize-area">
		<div class="col-6">
			<div class="existing_file"></div>
			<div class="download_file">
				Upload your prize <input type="file" name="prize_file"  accept="*/*">
			</div>

		</div>
		<div class="col-6">
			Max nbr downloads
			<input type="number" min="0" name="max_downloads">
		</div>
	</div>
	<div class="prize-form-row desc-area">
		<div id="prize_description" data-edits="prize_description"></div>
		<input type="hidden" name="prize_description">
	</div>
	</div>
	<div class="prize-form-row row">
		<div class="col-9 winners_picking_area">
			<div id="no-pickers">No winner(s) will be automatically picked for this prize.</div>
		</div>
		<div class="col-3 text-right">
			<button type="button" class="add_picker_time upgrade_popup" data-f="64" disabled>Add pick time</button>
		</div>
	</div>
	<div class="prize-form-row">
		<button type="submit" class="btn btn-block  btn-primary" id="prize-form-button" >Add Prize
		</button>
	</div>
</form>
<script type="text/sass" id="picker_template">
	<div class="winners_row" id="##PICKER_ID##">
	<div>Pick</div>
	<div>
	<input type="number" min="1" max="100" value="1" aria-label="Winners" class="nbr_prize_winners picker_watcher"
	placeholder="Number"  data-id="##PICKER_ID##">
	</div>
	<div>
	winner<span class="winners_plural">s</span>
	</div>
	<div>
	<select class="pick_type picker_watcher rf-select" name="pick_at" data-id="##PICKER_ID##">
	<option value="contest_end" selected>at the end of the contest</option>
	<option value="at_time">at (time)</option>
	</select>
	</div>
	<div><input type="text" aria-label="When"  data-id="##PICKER_ID##" class="pick_time picker_watcher" placeholder="Pick a date"></div>
	<div class="remove_picker"><button type="button" data-id="##PICKER_ID##" class="remove_picker_time btn btn-sm btn-link"><i class="far fa-times-circle"></i></div>
	</div>
</script>
<script id="rules-generator" type="text/html">
<form class="rules_gen_form rf-contests-page">
	<div class="p-4">Our rules template is a starting point, it's your responsibility to ensure you're following all applicable laws.</div>
	<input type="hidden" name="minimum_age" value="13">
	<div class="row">
		<div class="col-6">
			<input type="text" id="comp" name="company_name" required="" autofocus="" class="form-control">
			<label for="comp" class="">Company</label>
		</div>
		<div class="col-6">
			<input type="text" id="allowed_countries" required="" name="allowed_countries" class="form-control">
			<label for="allowed_countries" class="">Countries allowed</label>
		</div>
		<div class="col-6">
			<input type="text" name="start_date" required="" id="start_date" class="form-control">
			<label class="active" for="start_date">Contest start date</label>
		</div>
		<div class="col-6">
			<input type="text" name="end_date" required="" id="end_date" class="form-control">
			<label class="active" for="end_date">End date</label>
		</div>
		<div class="col-6">
			<input type="text" name="country" required="" id="country" class="form-control">
			<label for="country">Country of contest</label>
		</div>
		<div class="col-6">
			<input type="text" name="prize_list" id="prize_name" class="form-control">
			<label for="end_date">Prize(s)</label>
		</div>
		<div class="col-6">
			<textarea name="address" required="" id="address" class="md-textarea form-control"  spellcheck="false"></textarea>
			<label for="address">Address</label>
		</div>
		<div class="col-6">
			<input type="url" required="" id="privacy_policy_url" name="privacy_policy_url" class="form-control">
			<label for="privacy_policy_url">Privacy policy URL</label>
		</div>
	</div>
	<div class="text-right mt-4">
		<button type="button" class="btn btn-light cancel_gen">Cancel</button>
		<button type="submit" class="btn btn-primary">Generate rules</button>
	</div>
</form>
</script>
