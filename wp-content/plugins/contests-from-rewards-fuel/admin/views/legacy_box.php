<script>
	var rf_wp_key = ' <?php echo  $rf_key; ?>';
	var rf_api_url = 'https://app.rewardsfuel.com/api/wp_v2/';
	jQuery(document).ready(function () {
        function get_hex(contest_id) {
            try {
                var v,
                    i,
                    f = 0,
                    a = [];
                contest_id += '';
                f = contest_id.length;

                for (i = 0; i < f; i++) {
                    a[i] = contest_id.charCodeAt(i).toString(16).replace(/^([\da-f])$/, "0$1");
                }
                return 'C2' + a.join('');
            } catch (e) {
                rf_admin.log("error_get_hex", e);
            }
        }
        jQuery.get(rf_api_url + 'get_contests/?key=' + rf_wp_key, function (r) {
            try {
                rf_admin.contests = r;
            }catch (e) {
                
            }
            let select = jQuery("#rf-contest-selector");
	        jQuery.each(r,function (ind,elm) {
                if(elm.name ===null)
                    elm.name = 'contest #'+elm.contest_id;
                select.append(`<option value="${elm.contest_id}">${elm.name}</option>`)
            })
        });
        jQuery(document).on("change","#rf-contest-selector",function (e) {
	        contest_id = jQuery(this).val();
            jQuery(".rf-legacy-input").val("[RF_CONTEST contest='"+(get_hex(contest_id)+"']"));
        })
    })
</script>
<div class="rf-legacy-box">
<select id="rf-contest-selector">
	<option value="0" disabled>Select contest to get embed code</option>
</select>
	<input type="text" class="rf-legacy-input" readonly placeholder="Contest embed code">
	<div class="copy-text">Copy &amp; paste to place contest.</div>
	<a href="" class="rf-legacy-link">Contests dashboard</a>
</div>
<style>
	.rf-legacy-input, #rf-contest-selector{
		width: 100%;
		margin:.5rem 0;
		text-align: center;
	}
	.rf-legacy-link,.copy-text{
		width: 100%;
		margin:.5rem 0;
		text-align: center;
		display: block;
	}
</style>
