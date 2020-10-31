<div class="settings_panel" data-s="schedule">
	<div class="rf-loader schedule-loader hidden"><img src='https://cdn.rewardsfuel.com/assets/images/wl_loader.svg'></div>
	<form id="rf-contest-schedule">
	<div class="row">
		<div class="col-7">
			<h4>Contest schedule &amp status</h4>
		</div>
		<div class="col-5">
			<select class="rf-select rf-save-schedule" name="status">
				<option value="" disabled>Change contest status</option>
				<!--<option value="started" >Draft</option>-->
				<option value="ready" >Scheduled & ready</option>
				<option value="live" >Live</option>
				<option value="paused" >Paused</option>
				<option value="completed" >Completed</option>
			</select>
		</div>
	</div>

	<div class="switch rf-settings-row ">
		<label>
			Scheduled: off
			<input type="checkbox" value="1" class="rf-save-schedule" name="scheduled">
			<span class="lever" value="1">
				    <small></small>
			</span> On
		</label>
	</div>
	<div id="contest-schedule-area">
		<div  class="row rf-settings-row " >
		<div class="col-4">Schedule</div>
		<div class="col-8"><input type="text" class="rf-save-schedule" id="contest-schedule"></div>
			<input type="hidden" name="start_time">
			<input type="hidden" name="end_time">
		</div>
	</div>
	<button type="submit" disabled class="btn btn-block btn-primary save-schedule mt-4">Save schedule / state</button>

	</form>
</div>
