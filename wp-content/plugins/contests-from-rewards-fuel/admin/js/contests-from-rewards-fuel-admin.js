function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var rf_admin = {};

rf_admin.get_contests = function (callback) {
	jQuery.get(rf_api_url + 'get_contests/?key=' + rf_wp_key, function (r) {
		rf_admin.contests = r;

		if (String(_typeof(callback)) === "function") {
			callback(r);
		}
	});
};

rf_admin.contests = [];
rf_admin.entry_methods = [];
rf_admin.available_entry_methods = [];
rf_admin.entry_method_forms = [];
rf_admin.active_contest_id = false;
rf_admin.active_contest = false;
rf_admin.editable_entry_methods = [];
rf_admin.prizes = [];
rf_admin.contests = [];
rf_admin.mode = "add";
rf_admin.activate_redirect = false;
rf_admin.filling_schedule = false;
rf_admin.filling_contest_selector = false;
rf_admin.number_of_pickers = 0;
rf_admin.prize_pickers = [];
rf_admin.popup_schedule = false;
rf_admin.sign_in_url = 'https://app.rewardsfuel.com/wp_rd/?key=' + rf_wp_key;
rf_admin.filling_pickers = false;
rf_admin.upgrade = false;
rf_admin.show_copy_success = false;
rf_admin.wys_counter = 0;

rf_admin.set_cookie = function (name, value, days) {
	var expires = "";

	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
	}

	document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

rf_admin.get_cookie = function (name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');

	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];

		while (c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}

		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}

	return false;
};

rf_admin.init_listeners = function () {
	try {
		jQuery(document).on("mouseenter", ".palette_button", function () {
			rf_admin.send_to_frame({
				"preview_color": jQuery(this).data("id")
			});
		});
		jQuery(document).on("change", "#rf-contest-font-flipper", function (e) {
			rf_admin.send_to_frame({
				"preview_font": jQuery(this).val()
			});
		});
		jQuery(document).on("click", ".palette_button", function () {
			var palette_id = jQuery(this).data("id");
			rf_admin.send_to_frame({
				"change_color": palette_id
			});
			rf_admin.mark_selected_color(palette_id, false);
		});
		jQuery(document).on("click", "#rf-settings-controls button", function (e) {
			var selected = jQuery(this).data("s");
			jQuery("#rf-settings-controls button").removeClass("active");
			jQuery(this).addClass("active");
			jQuery(".settings_panel").hide();
			jQuery('.settings_panel[data-s=' + selected + ']').show();
		});
		jQuery(document).on("click", ".rf-em-button", function (e) {
			var type = jQuery(this).data("t");

			if (jQuery(this).hasClass("not-avail")) {
				rf_admin.sell_entry_method(type);
				return;
			}

			rf_admin.create_entry_method_form(type, 'add');
		});
		jQuery(document).on("submit", ".add_entry_method_form, .edit_entry_method_form", function (e) {
			e.preventDefault();
			var add_edit = 'add';
			var url = rf_api_url + "add_entry_method";
			var editing_id = 0;

			if (jQuery(this).hasClass("edit_entry_method_form")) {
				add_edit = 'edit';
				url = rf_api_url + "edit_entry_method";
				editing_id = jQuery(this).find('[name="e"]').val();
			}

			var container = jQuery("#rf-entry-method-form-holder");
			var data = jQuery(this).serializeArray();
			data[data.length] = {
				name: 'key',
				value: rf_wp_key
			};
			container.html(rf_loading_ing);
			jQuery.post(url, data, function (r) {
				jQuery(".choose-entry-method-area").show();

				if (add_edit == "add") {
					if (r.result) {
						rf_admin.editable_entry_methods.push(r.entry_method);
						rf_admin.layout_editable_entry_methods();
						setTimeout(function () {
							jQuery('.em_editor_row[data-id="' + r.entry_method.entry_method_id + '"]').animate_css("flash");
						}, 900);
					}
				} else {
					for (var i = 0; i < rf_admin.editable_entry_methods.length; i++) {
						if (String(editing_id) == String(rf_admin.editable_entry_methods[i].entry_method_id)) {
							rf_admin.editable_entry_methods[i] = r;
							rf_admin.layout_editable_entry_methods();
							setTimeout(function () {
								jQuery('.em_editor_row[data-id="' + editing_id + '"]').animate_css("flash");
							}, 900);
						}
					}
				}

				rf_admin.send_to_frame({
					"updated_entry_methods": rf_admin.editable_entry_methods,
					"key": rf_wp_key
				});
				jQuery("#rf-contest-body-styler").show();
				jQuery("#rf-entry-method-form-holder").hide();
			});
		});
		jQuery(document).on("change", ".edits_em", function (e) {
			var data = {
				id: jQuery(this).data("edits"),
				field: jQuery(this).data("field"),
				v: jQuery(this).val(),
				key: rf_wp_key
			};
			jQuery.post(rf_api_url + "edit_em", data);
			rf_admin.update_in_page_entry_method_values(data);
		});
		jQuery(document).on("click", "[href=\"#desc_area\"]", function (e) {
			if (jQuery(this).find(".fa-angle-up").length) {
				jQuery(this).find(".fa-angle-up").addClass("fa-angle-down").removeClass("fa-angle-up");
			} else {
				jQuery(this).find(".fa-angle-down").addClass("fa-angle-up").removeClass("fa-angle-down");
			}

			if (!jQuery("#rf-entry-method-form-holder .ql-toolbar").length) {
				rf_admin.wys("#rf-entry-method-form-holder  #wys_details_editor", ""); //add wys
			} else {
				if (jQuery("#rf-entry-method-form-holder  .ql-toolbar").length > 1) {
					jQuery("#rf-entry-method-form-holder  .ql-toolbar").first().remove();
				}
			}
		});
		jQuery(document).on("click", ".create-new-rf-contest", function (e) {
			alertify.prompt('New contest name', '', '', function (evt, value) {
				rf_admin.create_new_contest(value);
			}, function () {}).set('labels', {
				ok: 'Create',
				cancel: 'Cancel'
			});
		});
		jQuery(document).on("click", ".remove_em", function (e) {
			e.preventDefault();
			var id = jQuery(this).data("edits");
			var data = {
				entry_method_id: id,
				key: rf_wp_key
			};
			jQuery(this).closest(".em_editor_row").remove();
			var ems = rf_admin.editable_entry_methods;

			for (var i = 0; i < ems.length; i++) {
				if (String(ems[i].entry_method_id) == String(id)) {
					rf_admin.editable_entry_methods.splice(i, 1);
					rf_admin.update_frame_entry_methods();
					rf_admin.update_em_count(true);
				}
			}

			if (rf_admin.editable_entry_methods.length == 0) {
				jQuery("#edit-entry-methods").html("<button class=\"btn btn-block no-entry-methods btn-link text-center mt-3 mb-3\">No entry methods yet, click to add one</button>");
			}

			jQuery.post(rf_api_url + "remove_em", data);
		});
		jQuery(document).on("change", "[name='prize_type']", function (e) {
			var dig_area = jQuery(".digital-prize-area");

			if (jQuery(this).val() == "digital") {
				dig_area.show();
			} else {
				dig_area.hide();
			}
		});
		jQuery(document).on("click", ".edit_entry_method", function (e) {
			e.preventDefault();
			var entry_method_id = jQuery(this).data("id");
			var entry_type_id = jQuery(this).data("t");
			rf_admin.create_entry_method_form(entry_type_id, 'edit', entry_method_id);
		});
		jQuery(document).on("click", ".help-popup", function (e) {
			e.preventDefault();
			alertify.alert("Have a question? Please ask.", jQuery("#rf-help-popup").html(), "").setting({
				'label': 'Close'
			}).show();
		});
		jQuery(document).on("submit", ".rf-prize-form", function (e) {
			e.preventDefault();
			var data = jQuery(this)[0];
			rf_admin.submit_prize(data);
		});
		jQuery(document).on("click", ".rf-edit-prize", function (e) {
			e.preventDefault();
			var prize_id = jQuery(this).data("id");
			var prize = rf_admin.get_prize_by_id(prize_id);
			rf_admin.prep_prize_form("edit", prize);
		});
		jQuery(document).on("click", ".rf-btn-change-embed", function (e) {
			e.preventDefault();
			var type = jQuery(this).data("t");
			var cont = jQuery("#rf-embed-box");
			cont.val(rf_admin.get_embed_code(type));
		});
		jQuery(document).on("change", "[name=\"contest_rules\"]", function (e) {
			rf_admin.prep_rules_settings();
			rf_admin.send_to_frame({
				update_rules: jQuery(this).val()
			});
		});
		jQuery(document).on("click", "[name=\"contest_rules\"]", function (e) {
			rf_admin.prep_rules_settings();
			rf_admin.send_to_frame({
				update_rules: jQuery(this).val()
			});
		});
		jQuery(document).on("click", "#rf-settings-controls  [data-s='schedule']", function (e) {
			rf_admin.prep_schedule_area();
		});
		jQuery(document).on("click", "#rf-settings-controls  [data-s='gdpr']", function (e) {
			rf_admin.prep_gdpr_settings();
		});
		jQuery(document).on("click", "#rf-settings-controls  [data-s='age_geo']", function (e) {
			rf_admin.prep_age_geo();
		});
		jQuery(document).on("click", "#rf-settings-controls  [data-s='rules']", function (e) {
			rf_admin.prep_rules_settings();
		});
		jQuery(document).on("change", "#contest-editor-selector", function (e) {
			rf_admin.active_contest = rf_admin.change_contest(jQuery(this).val());
		});
		jQuery(document).on("change", "[name=\"contest_scheduled\"]", function (e) {
			var scheduled = false;

			if (jQuery(this).is(":checked")) {
				jQuery("#contest-schedule-area").show();
				scheduled = true;
			} else {
				jQuery("#contest-schedule-area").hide();
			}

			rf_admin.send_to_frame({
				"change_scheduled": scheduled
			});
		});
		jQuery(document).on("click", ".rf-delete-prize", function (e) {
			e.preventDefault();
			var prize_id = jQuery(this).closest("form").find("[name='prize_id']").val();

			if (confirm("Delete this prize?")) {
				jQuery(".rf-edit-prize[data-id='" + prize_id + "']").remove();
				var _data = {
					prize_id: prize_id,
					key: rf_wp_key,
					c: rf_admin.active_contest_id
				};

				for (var i = 0; i < rf_admin.prizes.length; i++) {
					if (String(rf_admin.prizes[i].prize_id) == String(prize_id)) {
						rf_admin.prizes.splice(i, 1);
						rf_admin.layout_prizes();
						break;
					}
				}

				jQuery.post(rf_api_url + 'remove_prize', _data);
				rf_admin.prep_prize_form("add");
			}
		});
		jQuery(document).on("change", ".rf-auto-save", function () {
			var auto_save = {
				n: jQuery(this).data("saves"),
				v: jQuery(this).val()
			};

			if (auto_save.n === "display_winners" || auto_save.n === "scheduled") {
				auto_save.v = 0;
				if (jQuery(this).is(":checked")) auto_save.v = 1;
			}

			if (auto_save.n === "geo_restrictions") {
				auto_save.v = "none";
				if (jQuery(this).is(":checked")) auto_save.v = "ask_birthday";
			}

			rf_admin.auto_save(auto_save);
		});
		jQuery(document).on("submit", "#rf-contest-schedule", function (e) {
			e.preventDefault();
			var data = jQuery(this).serializeArray();
			data[data.length] = {
				name: "key",
				value: rf_wp_key
			};
			data[data.length] = {
				name: "c",
				value: rf_admin.active_contest_id
			}; //show loader

			jQuery(".schedule-loader").show();
			jQuery("#rf-contest-schedule").hide();
			jQuery.post(rf_api_url + 'update_schedule', data, function (r) {
				//hide loader
				jQuery(".schedule-loader").hide();
				jQuery("#rf-contest-schedule").show();

				if (rf_admin.popup_schedule) {
					rf_admin.popup_schedule = false;

					try {
						alertify.closeAll();
						rf_admin.init_contests_table();
					} catch (e) {}
				}
			});
		});
		jQuery(document).on("change", ".rf-save-schedule", function () {
			if (!rf_admin.filling_schedule) jQuery(".save-schedule").removeAttr("disabled").animate_css("flash");
		});
		jQuery(document).on("change", "[name=\"scheduled\"]", function (e) {
			if (jQuery(this).is(":checked")) {
				jQuery("#contest-schedule-area").show();
			} else {
				jQuery("#contest-schedule-area").hide();
			}
		});
		jQuery(document).on("change", "[data-saves='ask_for_consent_first']", function (e) {
			if (jQuery(this).is(":checked")) {
				jQuery(".consent_area").show();
			} else {
				jQuery(".consent_area").hide();
			}
		});
		jQuery(document).on("click", ".copy_area_text_area", function (e) {
			jQuery(".copy_area").trigger("click");
			console.log("copy area triggered");
		});
		jQuery(document).on("click", ".contest-nav", function (e) {
			var selected = jQuery(this).data("target");
			if (selected !== 'embeds') rf_admin.selected_nav(selected);else alertify.alert('Embed contest', '<h2>Copy and paste this into any blog post or page</h2><input type="text" style="width: 100%; padding:1rem;border-radius: 0; border:none;border-bottom:solid 1px; text-align: center" value="' + rf_admin.get_embed_code("wp") + '"><div class="p-2 text-center"><a href="#" class="embed-more-options">More options</a></div>');
		});
		jQuery(document).on("click", '.embed-more-options', function (e) {
			e.preventDefault();
			alertify.closeAll();
			jQuery("[data-target=\"settings\"]").first().trigger("click");
		});
		jQuery(document).on("click", ".generate-rules", function (e) {
			rf_admin.rules_generator();
		});
		jQuery(document).on("click", ".cancel_gen", function (e) {
			alertify.closeAll();
		});
		jQuery(document).on("submit", ".rules_gen_form", function (e) {
			e.preventDefault();
			var data = jQuery(this).serializeArray();
			data[data.length] = {
				name: "key",
				value: rf_wp_key
			};
			data[data.length] = {
				name: "c",
				value: rf_admin.active_contest_id
			};
			jQuery(this).html(rf_loading_ing);
			jQuery.post(rf_api_url + 'generate_rules', data, function (r) {
				jQuery(".rules_wys .ql-editor").html(r.terms);
				jQuery('[name="terms"]').val(r.terms);
				alertify.closeAll();
			});
		});
		jQuery(document).on("submit", ".update-geo", function (e) {
			e.preventDefault();
			var data = jQuery(this).serializeArray();
			data[data.length] = {
				name: "key",
				value: rf_wp_key
			};
			data[data.length] = {
				name: "c",
				value: rf_admin.active_contest_id
			};
			jQuery.post(rf_api_url + 'update_geo', data, function (r) {});
		}); //prize pickers

		jQuery(document).on("change", ".pick_type", function (e) {
			if (jQuery(this).val() === "") return;
			var date_selector = jQuery(this).closest('.winners_row').find('.pick_time');

			if (jQuery(this).val() === "at_time") {
				date_selector.css("display", "inline-block");
			} else {
				date_selector.css("display", "none");
			}
		});
		jQuery(document).on("click", ".add_picker_time", function (e) {
			var id = "p" + jQuery.now();
			rf_admin.add_picker(id, true);
		});
		jQuery(document).on("click", ".remove_picker_time", function (e) {
			var id = jQuery(this).data("id"); //remove from array

			jQuery("#" + id).remove();
			rf_admin.number_of_pickers--;

			for (var i = 0; i < rf_admin.prize_pickers.length; i++) {
				if (String(rf_admin.prize_pickers[i].picker_id) === String(id)) {
					rf_admin.prize_pickers.splice(i, 1);
					break;
				}
			}
		});
		jQuery(document).on("change", ".picker_watcher", function (e) {
			if (!rf_admin.filling_pickers) {
				var id = jQuery(this).data("id");
				var picker_obj = rf_admin.get_picker_values(id);

				for (var i = 0; i < rf_admin.prize_pickers.length; i++) {
					if (String(rf_admin.prize_pickers[i].picker_id) === String(id)) {
						rf_admin.prize_pickers[i] = picker_obj;
					}
				}
			}
		});
		jQuery(document).on("click", ".remove_existing_file", function (e) {
			jQuery(".existing_file").hide();
			jQuery(".download_file").show();
		});
		jQuery(document).on("click", ".rf-create-prize", function (e) {
			e.preventDefault();
			rf_admin.prep_prize_form("add");
		}); //account page

		jQuery(document).on("click", ".change-to-sign-up", function (e) {
			e.preventDefault();
			jQuery('[href="#sign-up"]').first().trigger("click");
		});
		jQuery(document).on("click", ".rf-forgot-pass", function (e) {
			e.preventDefault();
			var email_cont = jQuery("#email-sign-in");

			if (!rf_admin.validate_email(email_cont.val())) {
				alertify.set('notifier', 'position', 'top-right');
				alertify.notify('Please fill in your email', 'custom', 2);
				email_cont.animate_css("bounce");
				email_cont.focus();
				return false;
			}

			rf_admin.retrieve_password(email_cont.val());
		});
		jQuery(document).on("submit", "#rf-sign-up-form", function (e) {
			e.preventDefault();
			var data = jQuery(this).serializeArray();
			data[data.length] = {
				name: "key",
				value: rf_wp_key
			};
			data[data.length] = {
				name: "url",
				value: site_url
			}; //show loader

			jQuery(".account-loader").show();
			jQuery(".sign_in_area").hide();
			jQuery.post(rf_api_url + 'sign_up', data, function (r) {
				var message = "Signed up...reloading";

				if (r.result) {
					//success (swap key,. change page to signed in version)
					data = {
						'action': 'rf_ajax_handler',
						'update_rewards_fuel_api_key': r.key
					};
					jQuery.post(ajaxurl, data, function () {
						if (rf_admin.activate_redirect != false) {
							rf_admin.activate_redirect = rf_admin.update_qs_param(rf_admin.activate_redirect, 'key', r.key);
							window.location.href = rf_admin.activate_redirect;
							return;
						}

						setTimeout(function () {
							window.location.reload();
						}, 1500);
					});
				} else {
					// failure (show message (already signed up, please sign in))
					//hide loader
					jQuery(".account-loader").hide();
					jQuery(".sign_in_area").show();
					message = r.message;
				}

				alertify.set('notifier', 'position', 'top-right');
				alertify.notify(message, 'custom', 2);
			});
		});
		jQuery(document).on("submit", "#rf-sign-in-form", function (e) {
			e.preventDefault();
			var data = jQuery(this).serializeArray();
			data[data.length] = {
				name: "key",
				value: rf_wp_key
			};
			data[data.length] = {
				name: "url",
				value: site_url
			};
			jQuery(".account-loader").show();
			jQuery(".sign_in_area").hide();
			jQuery.post(rf_api_url + 'sign_in', data, function (r) {
				var message = "Signed in, reloading...";

				if (r.result) {
					data = {
						'action': 'rf_ajax_handler',
						'update_rewards_fuel_api_key': r.key
					}; //update key in Wordpress

					jQuery.post(ajaxurl, data, function () {
						if (rf_admin.activate_redirect != false) {
							rf_admin.activate_redirect = rf_admin.update_qs_param(rf_admin.activate_redirect, 'key', r.key);
							window.location.href = rf_admin.activate_redirect;
							return;
						}

						setTimeout(function () {
							window.location.reload();
						}, 1800);
					});
				} else {
					// failure (show message (already signed up, please sign in))
					//hide loader
					alert("Sorry your password or email wasn't correct. Please use the lost password.");
					jQuery(".account-loader").hide();
					jQuery(".sign_in_area").show();
					message = r.message;
				}

				alertify.set('notifier', 'position', 'top-right');
				alertify.notify(message, 'custom', 2);
			});
		});
		jQuery(document).on("click", ".delete-account", function (e) {
			e.preventDefault();
			alertify.confirm('Delete your account?', 'Are you sure?', function () {
				jQuery.post(rf_api_url + 'delete_account', {
					key: rf_wp_key
				}, function (r) {
					var data = {
						'action': 'rf_ajax_handler',
						'update_rewards_fuel_api_key': r
					}; //update key in Wordpress

					jQuery.post(ajaxurl, data, function () {
						window.location.reload();
					});
				});
			}, function () {
				console.log("cancelled");
			});
		}); //onboard

		jQuery(document).on("click", ".activate-reason-link, .upgrade-link, #full-stats-link,.edit_direct_link", function (e) {
			if (rf_wp_key.includes("SK")) {
				e.preventDefault();
				rf_admin.activate_redirect = jQuery(this).attr("href");
				rf_admin.set_cookie("_rf_activate_redirect", rf_admin.activate_redirect, 1);
				alertify.alert().set({
					'startMaximized': true,
					title: "Sign in",
					'label': 'close',
					'message': rf_admin.upgrade
				}).show();
			}
		});
		jQuery(document).on("click", ".lite-editor", function (e) {
			var need_to_reload = false;
			e.preventDefault();
			alertify.alert().set({
				'startMaximized': true,
				title: "Full editor",
				'label': 'close',
				onclose: function onclose() {
					if (need_to_reload) {
						window.location.reload();
					} else {
						document.getElementById('contest-editor-frame').contentWindow.location.reload();
					}
				},
				'message': jQuery('<div><img src="https://app.rewardsfuel.com/assets/images/loader.svg"></div>').load(rf_api_url + 'remote_editor/?c=' + rf_admin.active_contest_id + '&key=' + rf_wp_key, function (r) {
					var nk = jQuery("#rf-nk").val();

					if (String(nk) != "0") {
						var _data2 = {
							'action': 'rf_ajax_handler',
							'update_rewards_fuel_api_key': new_key
						};
						jQuery.post(ajaxurl, _data2); //no close reload page

						need_to_reload = true;
					}
				})
			}).show();
		});
		jQuery(document).on("click", ".more-details-embed", function (e) {
			e.preventDefault();
			jQuery("[data-target=\"settings\"]").first().trigger("click");
		});
		jQuery(document).on("submit", "#account_live_help,#welcome_live_help", function (e) {
			e.preventDefault();
			var msg_cont = jQuery('[name="message"]');
			var data = {
				key: rf_wp_key,
				message: msg_cont.val()
			};
			alertify.closeAll();

			if (rf_wp_key.includes("SK")) {
				alertify.prompt("We need an email to reply back to", "", "", function (event, result) {
					if (result === null) return true;
					data.email = result;
					jQuery.post(rf_api_url + 'contact', data);
					alertify.set('notifier', 'position', 'top-right');
					alertify.notify("We'll be in touch soon", 'custom', 2);
				}, function () {}).setting({
					'title': 'Reply to email.'
				}).show();
			} else {
				var _data3 = {
					key: rf_wp_key,
					message: msg_cont.val()
				};
				jQuery.post(rf_api_url + 'contact', _data3);
				alertify.set('notifier', 'position', 'top-right');
				alertify.notify("We'll be in touch soon", 'custom', 2);
			}
		});
		jQuery(document).on("click", ".disconnect-key", function (e) {
			e.preventDefault();
			alertify.confirm("Are you sure you want to disconnect", function () {
				var data = {
					'url': window.location.href,
					'first_name': 'disco',
					'last_name': 'nected',
					'email': Math.floor(Date.now() / 1000)
				};
				jQuery.post(rf_api_url + "create_key", data, function (soft_key) {
					var data = {
						'action': 'rf_ajax_handler',
						'update_rewards_fuel_api_key': soft_key
					};
					jQuery.post(ajaxurl, data, function (r) {
						window.location.reload();
					}); //post to server
				});
			}, function () {//cancelled
			});
		});
		jQuery(document).on("click", ".no-entry-methods", function (e) {
			e.preventDefault();
			jQuery("#add-entry-methods").animate_css("bounce");
		}); //dashboard page

		jQuery(document).on("click", ".contest-name-area .embed-contest", function (e) {
			var contest_id = jQuery(this).data("id");
			rf_admin.active_contest = contest_id;
			alertify.alert('Share or Embed your contest', jQuery("#embed-area").html()).set('resizable', true).resizeTo('60%', '60%');
			rf_admin.active_contest = {};
			rf_admin.active_contest.hexed_id = rf_admin.get_hex(contest_id);
			setTimeout(function () {
				rf_admin.prep_general_settings();
			}, 500);
		});
		jQuery(document).on("click", ".contest-name-area .copy-contest ", function (e) {
			var contest_id = jQuery(this).data("id");
			alertify.prompt('Copy contest', 'Please give your new contest a name.', 'Contest name', function (evt, value) {
				var data = {
					key: rf_wp_key,
					c: contest_id,
					'name': value
				};
				jQuery.post(rf_api_url + 'copy_contest', data, function (r) {
					if (r.copied) {
						alertify.set('notifier', 'position', 'top-right');
						alertify.notify('Success, redirecting you to the contest.', 'custom', 2);
						setTimeout(function () {
							window.location.href = 'admin.php?page=rewards_fuel_dashboard&c=' + r.new_contest_id;
						}, 1500);
					} else {
						alertify.set('notifier', 'position', 'top-right');
						alertify.notify('There was an error copying your contest, sorry.', 'custom', 2);
					}
				});
			}, function () {
				return true; //cancelled
			});
		});
		jQuery(document).on("click", ".contest-name-area .edit-contest", function (e) {
			var contest_id = jQuery(this).data("id"); //show loading

			window.location.href = 'admin.php?page=rewards_fuel_contest_editor&c=' + contest_id;
		});
		jQuery(document).on("click", ".contest-name-area .stats-contest", function (e) {
			var contest_id = jQuery(this).data("id");
			var redirect = rf_api_url + "wp_rd/?key=" + rf_wp_key + "&rd=cs&c=" + contest_id;

			if (rf_wp_key.includes("SK")) {
				rf_admin.activate_redirect = redirect;
				rf_admin.set_cookie("_rf_activate_redirect", rf_admin.activate_redirect, 1);
				alertify.alert().set({
					'startMaximized': true,
					title: "Sign in",
					'label': 'close',
					'message': rf_admin.upgrade
				}).show();
			} else {
				window.location.href = redirect;
			}
		});
		jQuery(document).on("click", ".rf_buy_now,.activate-reason-link,.up_seller", function (e) {
			var redirect = rf_api_url + "wp_rd/?key=" + rf_wp_key + "&rd=ug";

			if (rf_wp_key.includes("SK")) {
				rf_admin.activate_redirect = redirect;
				rf_admin.set_cookie("_rf_activate_redirect", rf_admin.activate_redirect, 1);
				alertify.alert().set({
					'startMaximized': true,
					title: "Sign in",
					'label': 'close',
					'message': rf_admin.upgrade
				}).show();
			} else {
				window.location.href = redirect;
			}
		});
		jQuery(document).on("click", ".contest-name-area .delete-contest", function (e) {
			var contest_id = jQuery(this).data("id");
			var row = jQuery(this).closest("tr");
			alertify.confirm('Confirm deleting contest please', '', function () {
				var data = {
					key: rf_wp_key,
					c: contest_id
				};
				jQuery.post(rf_api_url + 'delete_contest', data);
				row.animate_css("zoomOut", function () {
					jQuery("#contest-name-" + contest_id).closest("tr").hide();
				});
			}, function () {
				return true;
			});
		});
		jQuery(document).on("click", ".contest-name-area .visit-contest", function (e) {
			var url = "https://r-f.page/".concat(rf_admin.get_hex(jQuery(this).data("id")));
			window.open(url);
		});
		jQuery(document).on("click", ".schedule-contest", function (e) {
			rf_admin.popup_schedule = true;
			rf_admin.active_contest_id = jQuery(this).data("id");
			rf_admin.get_contest(rf_admin.handle_scheduler);
			alertify.alert('Contest schedule', "<div id='popup_scheduler'>" + rf_loading_ing + "</div>").set('resizable', true).resizeTo('60%', '60%');
		});
		jQuery(document).on("click", ".view_contestants", function (e) {
			e.preventDefault();
			rf_admin.active_contest_id = jQuery(this).data("id");
			console.log("active active contest", rf_admin.active_contest_id);
			alertify.alert().set({
				'startMaximized': true,
				'title': "Contestants",
				'label': 'close',
				'message': jQuery("#contestants_report").html(),
				onshow: function onshow() {
					rf_admin.init_contestants_table();
					jQuery("#full-stats-link").attr("href", rf_api_url + "wp_rd/?key=".concat(rf_wp_key, "&rd=cs&c=").concat(rf_admin.active_contest_id));
				}
			}).show();
		});
		jQuery(document).on("click", ".change-status-contest", function (e) {
			var status = jQuery(this).data("status");
			var contest_id = jQuery(this).data("id");
			jQuery("#rf-loader").show();
			jQuery('#rf-dashboard').hide();
			var data = {
				"key": rf_wp_key,
				"c": contest_id,
				"s": status
			};
			jQuery.post(rf_api_url + 'change_status', data, function (r) {
				rf_admin.init_contests_table();
			});
		}); //welcome page

		jQuery(document).on("click", ".close-welcome", function (e) {
			jQuery("#rf-intro-video").remove();
			alertify.closeAll();
		});
		jQuery(document).on("click", ".rf-ask-a-question", function (e) {
			e.preventDefault();
			jQuery("#rf-intro-video").remove();
			alertify.closeAll();
			alertify.prompt().set({
				onshow: function onshow() {
					jQuery(".ajs-input").replaceWith("<textarea class=\"ajs-input rf-text-area\"  required></textarea>");
				}
			});
			alertify.prompt(' ').set('type', 'text', function (evt, value) {
				//if not logged in get an email else post
				alertify.success('You entered: ' + value);
			});
		});
		jQuery(document).on("click", ".contest-hand", function (e) {
			e.preventDefault();
			var message = "<div style='text-align: center'><h2>We're here to help.</h2><p>Please let us know what your contest goals are and how you would like your giveaway to look.  We can even create a custom made contest just for you. </p>";
			message += "<form class='contest-hand-rf'><input type='text' name='name' placeholder='name' required><input type='email' placeholder='email' name='email' required><textarea name='wp-help' required minlength='5' placeholder='Please describe how we can help.'></textarea><button type='submit'>Get a hand with your contest</button></form></div>";
			alertify.alert().set({
				title: "Get a hand with your contest.",
				'label': 'close',
				'startMaximized': true,
				'message': message
			}).show();
		});
		jQuery(document).on("submit", ".contest-hand-rf", function (e) {
			e.preventDefault();
			var data = jQuery(this).serializeArray();
			data[data.length] = {
				'name': 'key',
				'value': rf_wp_key
			};
			alertify.closeAll();
			jQuery.post(rf_api_url + 'contact', data);
			alertify.set('notifier', 'position', 'top-right');
			alertify.notify("We'll be in touch soon", 'custom', 2);
		});
	} catch (e) {
		rf_admin.log("error_init_listeners", e);
	}
};

rf_admin.validate_email = function (email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
};

rf_admin.retrieve_password = function (email) {
	jQuery.post(rf_api_url + "get_password", {
		email: email
	}, function (r) {
		alertify.set('notifier', 'position', 'top-right');
		alertify.notify(r.message, 'custom', 2);
	});
};

rf_admin.add_picker = function (id, add_to_pickers) {
	try {
		var pickers_area = jQuery(".winners_picking_area");
		var template = jQuery("#picker_template").html();
		template = template.replaceAll("##PICKER_ID##", id);
		jQuery("#no-pickers").hide();
		pickers_area.append(template);
		rf_admin.add_date_picker(jQuery(".pick_time[data-id='".concat(id, "']")));

		if (add_to_pickers) {
			rf_admin.number_of_pickers++;
			rf_admin.prize_pickers.push(rf_admin.get_picker_values(id));
		}

		if (rf_admin.number_of_pickers >= 1) {
			jQuery(".remove_picker").show();
		}
	} catch (e) {
		rf_admin.log("error_add_picker", e);
	}
};

rf_admin.add_existing_pickers = function (prize_data) {
	try {
		rf_admin.filling_pickers = true;

		if (jQuery.isArray(prize_data.pickers)) {
			jQuery.each(prize_data.pickers, function (ind, elm) {
				rf_admin.add_picker(elm.picker_id, false);
				jQuery(".nbr_prize_winners[data-id=\"".concat(elm.picker_id, "\"]")).val(elm.nbr_to_pick);
				jQuery(".pick_type[data-id=\"".concat(elm.picker_id, "\"]")).val(elm.pick_at);

				if (elm.pick_at === "at_time") {
					jQuery(".pick_time[data-id=\"".concat(elm.picker_id, "\"]")).attr("data-time", elm.pick_time);
					jQuery(".pick_time[data-id=\"".concat(elm.picker_id, "\"]")).data('daterangepicker').setStartDate(new Date(parseInt(elm.pick_time) * 1000));
					jQuery(".pick_time[data-id=\"".concat(elm.picker_id, "\"]")).show();
				}

				if (ind == prize_data.pickers.length - 1) rf_admin.filling_pickers = false;
			});
		}

		rf_admin.filling_pickers = false;
	} catch (e) {
		rf_admin.log("error_add_existing_pickers", e);
	}
};

rf_admin.get_picker_values = function (picker_id) {
	try {
		var picked_at = "contest_end";
		var pick_time = 0;

		if (jQuery(".pick_type[data-id='".concat(picker_id, "']")).val() == "at_time") {
			pick_time = jQuery(".pick_time[data-id=\"".concat(picker_id, "\"]")).attr("data-time");
			picked_at = "at_time";
		}

		return {
			'picker_id': picker_id,
			'pick_at': picked_at,
			'nbr_to_pick': jQuery(".nbr_prize_winners[data-id=\"".concat(picker_id, "\"]")).val(),
			'pick_time': pick_time
		};
	} catch (e) {
		rf_admin.log("error_get_picker_values", e);
	}
};

rf_admin.add_date_picker = function (elm) {
	try {
		var unx_time = Math.round(jQuery.now() / 1000);
		elm.attr("data-time", unx_time);
		elm.daterangepicker({
			singleDatePicker: true,
			showDropdowns: true,
			timePicker: true,
			locale: {
				format: 'DD/M/YY hh:mm A'
			},
			minDate: new Date()
		}, function (start, end, label) {
			elm.attr("data-time", start.unix());
		});
	} catch (e) {
		rf_admin.log("error_add_date_picker", e);
	}
};

rf_admin.rules_generator = function () {
	try {
		alertify.alert(jQuery("#rules-generator").html()).set('resizable', true).resizeTo('70%', '80%').set('frameless', true);
	} catch (e) {
		rf_admin.log("error_rules_generator", e);
	}
};

rf_admin.get_upgrade_content = function () {
	var data = {
		'action': 'rf_ajax_handler',
		'get_upgrade': true
	};
	jQuery.post(ajaxurl, data, function (r) {
		rf_admin.upgrade = r;
	});
};

rf_admin.create_new_contest = function (contest_name) {
	try {
		jQuery("#rf-loader").show();
		jQuery(".rf-contests-page").hide();
		var _data4 = {
			key: rf_wp_key,
			name: contest_name
		};
		jQuery.post(rf_api_url + "create_contest", _data4, function (r) {
			var new_contest_id = false;

			if (jQuery.isArray(r)) {
				new_contest_id = r[0].contest_id;
				rf_admin.active_contest_id = new_contest_id;
			}

			if (rf_admin_location == "contest") {
				var active = 0;

				if (new_contest_id != false) {
					rf_admin.contests = r;
					rf_admin.change_contest(new_contest_id);
					rf_admin.add_contests_to_selector(r);
				}

				jQuery("#rf-loader").hide();
				jQuery(".rf-contests-page").show();
			} else {
				//show loader
				window.location.href = 'admin.php?page=rewards_fuel_contest_editor&c=' + new_contest_id;
			}
		});
	} catch (e) {
		rf_admin.log("error_create_new_contest", e);
	}
};

rf_admin.selected_nav = function (target) {
	try {
		jQuery(".contest-nav").removeClass("active"); //unselect all selected

		jQuery(".contest-editor-nav").hide();
		jQuery("#nav-rf-contest-" + target).show(); //show correct nav

		jQuery(".rf-contest-editor-body").hide();
		jQuery("#rf-contest-body-" + target).show();
		rf_admin.prep_target(target);
		jQuery(".contest-nav[data-target='" + target + "']").addClass("active"); //mark this as selected
	} catch (e) {
		rf_admin.log("error_selected_nav", e);
	}
};

rf_admin.prep_target = function (target) {
	var settings_area = jQuery("#rf-contest-settings-area");
	var contest_area = jQuery("#rf-contest-body-styler");

	try {
		switch (target) {
			case "styler":
				settings_area.hide();
				contest_area.show();

			case "entry-methods":
				jQuery("#rf-contest-body-styler").show(); //show styler frame by default

				break;

			case "prizes":
				rf_admin.prep_prize_form("add");
				settings_area.show();
				contest_area.hide();
				break;

			case "settings":
				rf_admin.prep_general_settings();
				settings_area.show();
				contest_area.hide();
				break;
		}
	} catch (e) {
		rf_admin.log("error_prep_target", e);
	}
};

rf_admin.prep_entry_method_form = function (add_or_edit, entry_method_id) {
	try {
		jQuery("#rf-contest-body-styler").hide();
		jQuery("#rf-entry-method-form-holder").show();
		var form = jQuery("._entry_method_form");
		form.find("[name='c']").val(rf_admin.active_contest_id); //add contest id

		form.find(".card").removeClass("card");
		var placeholder = form.find(".card-body p").html();
		form.find(".card-body p").remove();
		form.addClass(add_or_edit + "_entry_method_form");

		if (add_or_edit == "edit") {
			var entry_method = rf_admin.get_entry_method(entry_method_id);
			rf_admin.fill_form(entry_method);
			form.prepend("<input type=\"hidden\" name=\"e\" value=\"".concat(entry_method_id, "\">"));
		}

		var type_id = form.find("[name='t']").val();
		var edit_url = rf_admin.sign_in_url + "&rd=ec&c=" + rf_admin.active_contest_id + "&et=" + type_id;
		if (!isNaN(entry_method_id)) edit_url += "&em=" + entry_method_id;
		rf_admin.wys("#wys_details_editor", placeholder); //add wys

		form.find('.edit_direct_link').attr("href", edit_url);
		form.removeClass("_entry_method_form");
	} catch (e) {
		rf_admin.log("error_prep_entry_method_form", e);
	}
};

rf_admin.create_entry_method_form = function (entry_type, add_or_edit, entry_method_id) {
	try {
		jQuery("#rf-contest-body-styler").hide();
		jQuery("#rf-entry-method-form-holder").show();
		var in_page = rf_admin.is_entry_form_in_page(entry_type);
		var container = jQuery("#rf-entry-method-form-holder");

		if (in_page) {
			container.html(in_page);
			rf_admin.prep_entry_method_form(add_or_edit, entry_method_id);
		} else {
			container.html(rf_loading_ing);
			jQuery.get(rf_api_url + "get_em_form/?t=" + entry_type + "&key=" + rf_wp_key, function (r) {
				var form = r;
				container.html(form);
				rf_admin.entry_method_forms.push({
					id: entry_type,
					form: form
				});
				rf_admin.prep_entry_method_form(add_or_edit, entry_method_id);
			});
		}
	} catch (e) {
		rf_admin.log("error_create_entry_method_form", e);
	}
};

rf_admin.prep_general_settings = function () {
	try {
		var notify = function notify() {
			alertify.set('notifier', 'position', 'top-right');
			alertify.notify('Copied', 'custom', 2);
		};

		jQuery("[name='contest_name']").val(rf_admin.active_contest.name);
		if (String(rf_admin.active_contest.display_winners) == "1") jQuery("[data-saves=\"display_winners\"]").attr("checked", true);
		var cont = jQuery("#rf-embed-box");
		cont.val(rf_admin.get_embed_code("wp"));
		rf_admin.clipboard = new ClipboardJS('.copy_area');

		if (!rf_admin.show_copy_success) {
			rf_admin.show_copy_success = -true;
			rf_admin.clipboard.on('success', function (e) {
				notify();
				e.clearSelection();
			});
		}

		rf_admin.clipboard.on('error', function (e) {
			console.error('Action:', e.action);
			console.error('Trigger:', e.trigger);
		});
	} catch (e) {
		rf_admin.log("error_prep_general_settings", e);
	}
};

rf_admin.prep_rules_settings = function () {
	try {
		jQuery("[data-s=\"rules\"] .ql-toolbar").remove();
		jQuery("[name='terms']").val(rf_admin.active_contest.terms);
		rf_admin.wys(".rules_wys", jQuery('[name="terms"]').attr("placeholder"));
	} catch (e) {
		rf_admin.log("error_prep_rules_settings", e);
	}
};

rf_admin.prep_gdpr_settings = function () {
	try {
		jQuery("[data-s=\"gdpr\"] .ql-toolbar").remove();
		jQuery("[name='consent_first']").val(rf_admin.active_contest.consent_first);

		if (String(rf_admin.active_contest.ask_for_consent_first) === "1") {
			jQuery(".consent_area").show();
			jQuery('[data-saves="ask_for_consent_first"]').attr("checked", true);
		} else {
			jQuery(".consent_area").hide();
			jQuery('[data-saves="ask_for_consent_first"]').removeAttr("checked");
		}

		rf_admin.wys(".consent_first", jQuery('[name="consent_first"]').attr("placeholder"));
	} catch (e) {
		rf_admin.log("error_prep_gdpr_settings", e);
	}
};

rf_admin.prep_schedule_area = function () {
	try {
		rf_admin.filling_schedule = true;
		jQuery("[name='status']").val(rf_admin.active_contest.status);

		if (String(rf_admin.active_contest.scheduled) === "1") {
			jQuery('[name="scheduled"]').attr("checked", true);
			jQuery("#contest-schedule-area").show();
		} else {
			jQuery("#contest-schedule-area").hide();
		}

		jQuery("[name=\"start_time\"]").val(rf_admin.active_contest.start_time);
		jQuery("[name=\"end_time\"]").val(rf_admin.active_contest.end_time);
		jQuery('#contest-schedule').daterangepicker({
			timePicker: true,
			locale: {
				format: 'DD/M/YY hh:mm A'
			},
			startDate: new Date(rf_admin.active_contest.start_time * 1000),
			endDate: new Date(rf_admin.active_contest.end_time * 1000),
			minDate: new Date()
		}, function (start, end, label) {
			jQuery("[name=\"start_time\"]").val(Math.floor(start.valueOf() / 1000));
			jQuery("[name=\"end_time\"]").val(Math.floor(end.valueOf() / 1000));
		});
		rf_admin.filling_schedule = false;
	} catch (e) {
		rf_admin.log("error_prep_schedule_area", e);
	}
};

rf_admin.prep_age_geo = function () {
	try {
		var geo_area = jQuery("#geo_area");
		geo_area.append("<button class='up_seller' data-f='101' type='button'>Good choice!  Please click here to upgrade &amp; use location blocking.</button>");
		var height = geo_area.height();
		jQuery("#geo_area .up_seller").css("height", height + "px").css("line-height", height + "px");
		rf_admin.check_for_paid_feature(101, rf_admin.remove_age_blocker);
		var age_area = jQuery("#age_area");
		age_area.append("<button class='up_seller' data-f='90' type='button'>Good choice!  Please click here to upgrade &amp; use age verification.</button>");
		height = age_area.height();
		jQuery("#age_area .up_seller").css("height", height + "px").css("line-height", height + "px");
		rf_admin.check_for_paid_feature(90, rf_admin.remove_geo_blocking);
		jQuery("#age_restriction").val(rf_admin.active_contest.age_restriction);

		if (rf_admin.active_contest.geo_restrictions == "ask_birthday") {
			jQuery("[data-saves=\"geo_restrictions\"]").attr("checked", true);
		} else {
			jQuery("[data-saves=\"geo_restrictions\"]").removeAttr("checked");
		}

		jQuery.get(rf_api_url + 'get_geo_blocking/?c=' + rf_admin.active_contest_id + '&key=' + rf_wp_key, function (r) {
			if (String(r.allowed_or_blocked) == "1") {
				jQuery("[name=\"allowed\"]").attr("checked", true);
			} else {
				jQuery("[name=\"allowed\"]").removeAttr("checked");
			}

			try {
				if (r.country_codes != "") {
					var selected_countries = r.country_codes.split(",");

					for (var i = 0; i < selected_countries.length; i++) {
						jQuery('#countries_list option[value="' + selected_countries[i] + '"]').attr("selected", true);
					}
				}
			} catch (e) {
				jQuery();
			}

			jQuery('#countries_list').select2();
			setTimeout(function () {//jQuery('#countries_list').select2('open');
			}, 700);
		});
	} catch (e) {
		rf_admin.log("error_prep_age_geo", e);
	}
};

rf_admin.check_for_paid_feature = function (feature_id, callback) {
	try {
		if (rf_wp_key.includes("SK")) callback(false);
		jQuery.get(rf_api_url + "check_paid_feature/?key=".concat(rf_wp_key, "&f=") + feature_id, function (r) {
			callback(r);
		});
	} catch (e) {
		rf_admin.log("error_check_for_paid_feature", e);
	}
};

rf_admin.prep_prize_form = function (add_or_edit, prize_to_edit) {
	try {
		rf_admin.mode = add_or_edit;
		var delete_btn = jQuery(".rf-delete-prize");
		var digital_cont = jQuery(".digital-prize-area");
		digital_cont.hide();
		rf_admin.prize_pickers = [];
		jQuery(".rf-prize-title").html(add_or_edit + " prize");
		jQuery(".rf-prize-form").trigger("reset");
		delete_btn.hide();
		jQuery("#prize_description").html("");
		jQuery(".rf-prize-form .ql-toolbar").remove();
		jQuery('[name=\'prize_id\']').remove();
		jQuery("[name=\"prize_description\"]").val("");
		var prize_area = jQuery(".digital-prize-area");
		prize_area.append("<button class='up_seller' data-f='53' type='button'>Good choice!  Please click here to upgrade &amp; digital prizes.</button>");
		var height = prize_area.height();
		jQuery(".digital-prize-area .up_seller").css("height", height + "px").css("line-height", height + "px");
		rf_admin.check_for_paid_feature(53, rf_admin.remove_prize_features);
		jQuery("#prize-form-button").html(add_or_edit + " prize");

		if (add_or_edit == "edit") {
			rf_admin.prize_pickers = prize_to_edit.pickers;
			rf_admin.add_existing_pickers(prize_to_edit);
			delete_btn.show();
			delete_btn.attr("data-id", prize_to_edit.prize_id);
			jQuery(".rf-prize-form").append("<input type='hidden' name='prize_id'>");
			rf_admin.fill_form(prize_to_edit);

			if (prize_to_edit.prize_type == "digital") {
				digital_cont.show();
				jQuery(".download_file").hide();

				if (_typeof(prize_to_edit.downloadable_prizes) != undefined && prize_to_edit.downloadable_prizes != false && _typeof(prize_to_edit.downloadable_prizes.file_name) != undefined) {
					jQuery(".existing_file").html("<button type=\"button\" class=\"btn btn-sm btn-link remove_existing_file\"><i class=\"fas fa-times mr-2\"></i>Change file: ".concat(prize_to_edit.downloadable_prizes.file_name, "</button>")).show();
					jQuery("[name=\"max_downloads\"]").val(prize_to_edit.downloadable_prizes.max_number_of_downloads);
				}

				if (jQuery(".existing_file").html() == "") {
					jQuery(".download_file").show();
					jQuery(".existing_file").html("").hide();
				}
			}
		} else {
			jQuery('[name="prize_name"]').focus();
			jQuery(".download_file, #no-pickers").show();
			jQuery(".existing_file").html("").hide();
			jQuery(".winners_row").remove();
		}

		rf_admin.wys("#prize_description", "Describe your prize");
		jQuery(".prize-loader").hide();
		jQuery(".rf-prize-form").show().animate_css("flash");
	} catch (e) {
		rf_admin.log("error_prep_prize_form", e);
	}
};

rf_admin.remove_prize_features = function (r) {
	try {
		if (r) {
			jQuery(".digital-prize-area .up_seller").remove();
			jQuery(".add_picker_time").removeAttr("disabled").removeClass("upgrade_popup");
		}
	} catch (e) {
		rf_admin.log("error_remove_prize_features", e);
	}
};

rf_admin.remove_age_blocker = function (r) {
	try {
		if (r) {
			jQuery(".up_seller[data-f='101']").remove();
		}
	} catch (e) {
		rf_admin.log("error_remove_prize_features", e);
	}
};

rf_admin.remove_geo_blocking = function (r) {
	try {
		if (r) {
			jQuery(".up_seller[data-f='90']").remove();
		}
	} catch (e) {
		rf_admin.log("error_remove_prize_features", e);
	}
};

rf_admin.init_editor = function () {
	try {
		if (isNaN(jQuery("#contest-editor-selector").val())) {
			setTimeout(function () {
				rf_admin.init_editor();
			}, 500);
			return;
		}

		var active_contest_id = jQuery("#contest-editor-selector").val();
		var preview_url = rf_api_url + 'remote_editor/?c=' + active_contest_id + '&key=' + rf_wp_key;
		jQuery("#contest-editor-frame").attr("src", preview_url);
		rf_admin.active_contest_id = active_contest_id;
		rf_admin.add_available_entry_methods_to_editor();
		rf_admin.populate_font_picker();
		rf_admin.make_color_picker();
		rf_admin.add_frame_listener();
		rf_admin.selected_nav("styler");
		jQuery(".settings_panel[data-s='general']").show();
		jQuery(".embed_code").html("[RF_CONTEST contest='".concat(rf_admin.get_hex(active_contest_id), "']"));
		jQuery(".lite-editor").attr("href", rf_api_url + "wp_rd/?key=".concat(rf_wp_key, "&rd=ec&c=").concat(rf_admin.active_contest_id)).attr("target", "_blank");
	} catch (e) {
		rf_admin.log("error_init_editor", e);
	}
};

rf_admin.change_contest = function (new_contest_id) {
	var preview_url = rf_api_url + 'remote_editor/?c=' + new_contest_id + '&key=' + rf_wp_key;
	jQuery("#contest-editor-frame").attr("src", preview_url);
	rf_admin.active_contest_id = new_contest_id;
	jQuery(".embed_code").html("[RF_CONTEST contest='".concat(rf_admin.get_hex(new_contest_id), "']"));
	rf_admin.get_contest(); //makes active contest value legit

	jQuery("[data-target=\"styler\"]").first().trigger("click");
	rf_admin.get_contest_entry_methods();
	rf_admin.get_contest_prizes();
	jQuery(".lite-editor").attr("href", rf_api_url + "wp_rd/?key=".concat(rf_wp_key, "&rd=ec&c=").concat(rf_admin.active_contest_id)).attr("target", "_blank");
};

rf_admin.contests_ready = function (contests) {
	try {
		if (rf_admin.get_qs("c") == false) {
			//todo add no contests clause / screen here
			rf_admin.active_contest_id = contests[0].contest_id;
		} else {
			rf_admin.active_contest_id = rf_admin.get_qs("c");
		}

		rf_admin.add_contests_to_selector(contests);
		rf_admin.filling_contest_selector = false;
		rf_admin.get_contest(); //makes active contest value legit

		rf_admin.get_contest_entry_methods();
		rf_admin.get_contest_prizes();
	} catch (e) {
		rf_admin.log("error_contests_ready", e);
	}
};

rf_admin.auto_save = function (auto_save) {
	try {
		if (auto_save.n == "contest_name") {
			jQuery("#contest-editor-selector [value='" + rf_admin.active_contest_id + "']").html(auto_save.v);
			rf_admin.save_contest_value_in_page('name', auto_save.v);
			rf_admin.save_contest_value('name', auto_save.v);
			return;
		}

		rf_admin.save_contest_value_in_page(auto_save.n, auto_save.v);
		rf_admin.save_contest_value(auto_save.n, auto_save.v);
	} catch (e) {
		rf_admin.log("error_auto_save", e);
	}
};

rf_admin.save_contest_value_in_page = function (name, value) {
	rf_admin.active_contest[name] = value;
};

rf_admin.save_contest_value = function (name, value) {
	try {
		var _data5 = {
			n: name,
			v: value,
			key: rf_wp_key,
			c: rf_admin.active_contest_id
		};
		jQuery.post(rf_api_url + 'save_contest_val', _data5);
	} catch (e) {
		rf_admin.log("error_save_contest_value", e);
	}
};

rf_admin.update_em_count = function (flash) {
	jQuery(".em_count").html(rf_admin.editable_entry_methods.length);

	if (flash) {
		jQuery(".em_count").animate_css("flash");
	}
};

rf_admin.get_contest_entry_methods = function () {
	try {
		rf_admin.editable_entry_methods = [];
		jQuery.get(rf_api_url + "get_contest_entry_methods/?c=" + rf_admin.active_contest_id + "&key=" + rf_wp_key, function (r) {
			rf_admin.editable_entry_methods = r;
			rf_admin.layout_editable_entry_methods();
		});
	} catch (e) {
		rf_admin.log("error_get_contest_entry_methods", e);
	}
};

rf_admin.layout_editable_entry_methods = function () {
	return; //changed after using iframe.

	try {
		var container = jQuery("#edit-entry-methods");
		container.html("");

		if (jQuery.isArray(rf_admin.editable_entry_methods) && rf_admin.editable_entry_methods.length > 0) {
			jQuery.each(rf_admin.editable_entry_methods, function (ind, em) {
				container.append(rf_admin.create_edit_em_button(em));

				if (ind == rf_admin.editable_entry_methods.length - 1) {
					rf_admin.make_editable_em_drop_able();
				}
			});
		} else {
			container.html("<button class='btn btn-block no-entry-methods btn-link text-center mt-3 mb-3'>No entry methods yet, click to add one</button>");
		}
	} catch (e) {
		rf_admin.log("error_layout_editable_entry_methods", e);
	}
};

rf_admin.send_to_frame = function (message) {
	try {
		message.key = rf_wp_key;
		document.querySelector("#contest-editor-frame").contentWindow.postMessage(message, "*");
	} catch (e) {
		rf_admin.log("error_send_to_frame", e);
	}
};

rf_admin.populate_font_picker = function () {
	try {
		var select = jQuery("#rf-contest-font-flipper");
		jQuery.get('https://cdn.rewardsfuel.com/assets/fonts.json', function (r) {
			var html = "<option value='' disabled>Select your font</option>";
			jQuery.each(r.items, function (ind, elm) {
				html += "<option value=\"".concat(elm.family, "\">").concat(elm.family, "</option>");

				if (ind == r.items.length - 1) {
					select.html(html); //todo add preselected font
				}
			});
		});
	} catch (e) {
		rf_admin.log("error_populate_font_picker", e);
	}
};

rf_admin.is_entry_form_in_page = function (entry_type_id) {
	try {
		for (var i = 0; i < rf_admin.entry_method_forms.length; i++) {
			if (String(entry_type_id) == String(rf_admin.entry_method_forms[i].id)) {
				return rf_admin.entry_method_forms[i].form;
			}
		}

		return false;
	} catch (e) {
		rf_admin.log("error_is_entry_form_in_page", e);
	}
};

rf_admin.get_prize_by_id = function (prize_id) {
	try {
		for (var i = 0; i < rf_admin.prizes.length; i++) {
			if (String(prize_id) === String(rf_admin.prizes[i].prize_id)) {
				return rf_admin.prizes[i];
			}
		}

		return false;
	} catch (e) {
		rf_admin.log("error_is_entry_form_in_page", e);
	}
};
/******************contest editor page***************************/


rf_admin.get_contest = function (call_back) {
	try {
		jQuery.get(rf_api_url + "get_contest/?c=" + rf_admin.active_contest_id + "&key=" + rf_wp_key, function (r) {
			rf_admin.active_contest = r;
			rf_admin.mark_selected_font(r.layout.font);
			rf_admin.mark_selected_color(r.layout.color_palette_id, true);
			if (typeof call_back == "function") call_back(r);
		});
	} catch (e) {
		rf_admin.log("error_get_contest", e);
	}
};

rf_admin.add_frame_listener = function () {
	try {
		var receiveMessage = function receiveMessage(event) {
			try {
				if (!allowed_source.includes(event.origin)) return;
				if (typeof event.data.get_url !== "undefined") rf_admin.send_to_frame({
					"parent_url": window.location.href
				});

				if (typeof event.data.height !== "undefined") {
					jQuery("#contest-editor-frame").css("height", event.data.height + "px");
				}

				if (typeof event.data.rf_focus_top !== "undefined") {
					jQuery('html, body').animate({
						scrollTop: jQuery("#rf-contest-body-styler").offset().top
					}, 300);
				}

				if (typeof event.data.rf_new_key !== "undefined" && rf_wp_key.includes("SK")) {
					rf_wp_key = event.data.rf_new_key;
					data = {
						'action': 'rf_ajax_handler',
						'update_rewards_fuel_api_key': rf_wp_key
					};
					jQuery.post(ajaxurl, data);
				}

				if (typeof event.data.entry_methods !== "undefined") {
					jQuery(".contest-nav[data-target=\"entry-methods\"]").first().trigger("click"); //flip to entry methods first

					setTimeout(function () {
						jQuery(".entry-method-control").animate_css("flash");
					}, 800); //if edit focus on editable entry method
					//if add new then flash the buttons
				}

				if (typeof event.data.elm_editor !== "undefined") {
					var url = rf_api_url + "wp_rd/?key=".concat(rf_wp_key, "&rd=cs&c=").concat(rf_admin.active_contest_id);
					var message = "Sorry, this contest element cannot be edited from WordPress.   You can move it up or down as well as delete it from here.  \n\t\t\t\t\t\t\t<a href=\"".concat(url, "\" target=\"_blank\" class=\"btn btn-block btn-primary mt-3 mb-4\">Click here to launch full editor</a> You can edit it from the full editor (regardless of plan)");
					alertify.alert('Edit element', message);
				}
			} catch (e) {
				rf_admin.log("error_iframe_receiveMessage", e);
			}
		};

		var allowed_source = ["https://app.rewardsfuel.com", "https://rewardsfuel.com", "https://r-f.page", "https://app.rewardsfuel.com/", "https://rewardsfuel.com/", "https://r-f.page/"];
		window.addEventListener("message", receiveMessage, false);
		;
	} catch (e) {
		rf_admin.log("error_get_contest", e);
	}
};

rf_admin.add_available_entry_methods_to_editor = function () {
	try {
		jQuery.get(rf_api_url + "get_available_entry_methods/?key=" + rf_wp_key, function (r) {
			rf_admin.available_entry_methods = r;
			jQuery.get("https://app.rewardsfuel.com/api/feed/entry_methods", function (r) {
				rf_admin.entry_methods = r;
				rf_admin.add_entry_methods_to_page();
			});
		});
	} catch (e) {
		rf_admin.log("error_add_available_entry_methods_to_editor", e);
	}
};

rf_admin.add_entry_methods_to_page = function () {
	try {
		var html = '';
		jQuery.each(rf_admin.entry_methods, function (ind, elm) {
			html += "<button class=\"rf-em-button not-avail\" data-s=\"".concat(elm.rank, "\" data-t=\"").concat(elm.entry_type_id, "\"><i class=\"rf-icon icon-").concat(elm.entry_type_id, "\"></i>").concat(elm.entry_method_name, "</button>");

			if (ind == rf_admin.entry_methods.length - 1) {
				jQuery("#add-entry-methods").html(html); //mark available

				jQuery.each(rf_admin.available_entry_methods, function (ind, elm) {
					var btn = jQuery(".rf-em-button[data-t='".concat(elm.entry_type_id, "']"));
					btn.removeClass("not-avail");
					btn.addClass("available");
					btn.parent().prepend(btn);

					if (ind === parseInt(rf_admin.available_entry_methods.length) - 1) {
						var $wrapper = jQuery("#add-entry-methods");
						$wrapper.find('.available').sort(function (a, b) {
							return +jQuery(b).data('s') - +jQuery(a).data('s');
						}).prependTo($wrapper);
					}
				});
			}
		});
	} catch (e) {
		rf_admin.log("error_add_entry_methods_to_page", e);
	}
};

rf_admin.create_edit_em_button = function (em) {
	try {
		var name = em.default_button_text;
		if (em.button_text_override !== null) name = em.button_text_override;
		return "<li class=\"em_editor_row\" data-id=\"".concat(em.entry_method_id, "\">\n        <div class=\"row\">\n            <div class=\"col-3 move_handle pr-1\">\n                <i class=\"fas fa-arrows-alt mr-2\"></i>\n                <i class=\"rf-icon icon-").concat(em.entry_type_id, "\"></i>\n                <a href=\"#\" class=\"edit_entry_method mr-2\" data-id=\"").concat(em.entry_method_id, "\" data-t=\"").concat(em.entry_type_id, "\">EDIT</a>\n            </div>\n         \n            <div class=\"col-7 p-0\">\n                <input type=\"text\" data-edits=\"").concat(em.entry_method_id, "\" data-field=\"button_text_override\" id=\"bn_").concat(em.entry_method_id, "\" value=\"").concat(name, "\" class=\"form-control edits_em\">\n                <input type=\"number\" data-edits=\"").concat(em.entry_method_id, "\" data-field=\"points_per_entry\" id=\"pp_").concat(em.entry_method_id, "\" value=\"").concat(em.points_per_entry, "\" class=\"form-control edits_em\">\n            </div>\n           \n            <div class=\"col-2\">\n            \n                <a href=\"#\" class=\"remove_em\" data-edits=\"").concat(em.entry_method_id, "\">\n                    <i class=\"far fa-trash-alt\"></i>\n                </a>\n            </div>\n        </div>\n    </li>");
	} catch (e) {
		rf_admin.log("error_create_edit_em_button", e);
	}
};

rf_admin.make_editable_em_drop_able = function () {
	var sort_elm = document.getElementById('edit-entry-methods');
	new Sortable(sort_elm, {
		animation: 150,
		handle: ".move_handle",
		ghostClass: "custom-drag-ghost",
		onUpdate: function onUpdate(evt) {
			//var itemEl = evt.item; // the current dragged HTMLElement
			var em_in_order = [];
			var c = rf_admin.active_contest_id;
			jQuery.each(jQuery("#edit-entry-methods li"), function (ind, elm) {
				em_in_order.push({
					'id': jQuery(elm).data("id"),
					'priority': ind
				});

				if (ind == jQuery("#edit-entry-methods li").length - 1) {
					jQuery.post(rf_api_url + 'order_em', {
						'order': em_in_order,
						'c': c,
						'key': rf_wp_key
					});
					rf_admin.update_order_of_entry_methods(em_in_order); //update order in page
				}
			});
		}
	});
};

rf_admin.fill_form = function (entry_method_obj) {
	try {
		if (String(_typeof(entry_method_obj)) == "object") {
			var advanced_optioned_toggled = false;
			var nbr_to_fill = Object.keys(entry_method_obj).length;
			var emt = 0;
			var i = 0;
			jQuery.each(entry_method_obj, function (key, val) {
				i++;
				if (key == 'entry_type_id') emt = parseInt(val);

				try {
					if (String(_typeof(val)) == "boolean") {
						val = val ? 1 : 0;
					}

					if (String(_typeof(val)) == "object" && typeof val !== null) {//handle_edit_objects(key, val);
					}

					if (key == "points_per_entry") key = 'p';
					if (key == "description") key = "d";
					jQuery('[name=' + key + ']').val(val).trigger("change");
				} catch (e) {
					console.log("err filling in form", e);
				}

				if (i == nbr_to_fill) {
					jQuery(document).trigger("all_em_fields_filled");
					/*
					if (emt == 2)
						entry_method_editor.handle_newsletter_stuff();
					if (emt == 6 || emt == 7)
						entry_method_editor.embedded_tweets();
					if (emt == 15)
						entry_method_editor.list_keeper();
					if (emt == 19)
						entry_method_editor.form_entry_filler();
					if (emt == 21)
						entry_method_editor.yt_watcher();
					if (emt == 25)
						entry_method_editor.fill_spotify();
					if (emt == 27)
						entry_method_editor.file_uploader();
					if (emt == 34)
						entry_method_editor.handle_code_word_editor(entry_method_obj);
					if (jQuery(".edit_entry_method_form .verify_embed").length) {
						jQuery(".edit_entry_method_form .verify_embed").trigger("click");
					}
					*
					 */
				}
			});
		}
	} catch (e) {
		rf_admin.log("error_fill_form", e);
	}
};

rf_admin.add_contests_to_selector = function (contests) {
	try {
		var html = '<option value="0" disabled>Select contest to edit</option>';
		jQuery.each(contests, function (ind, elm) {
			var contest_name = "#".concat(elm.contest_id, " No name");
			if (elm.name != null && String(elm.name).trim() != "") contest_name = "#".concat(elm.contest_id, " ").concat(elm.name);
			html += "<option value=\"".concat(elm.contest_id, "\">").concat(contest_name, "</option>");

			if (ind == contests.length - 1) {
				//todo add no contest screen
				jQuery('#contest-editor-selector').html(html);
				jQuery('#contest-editor-selector').val(rf_admin.active_contest_id);
			}
		});
	} catch (e) {
		rf_admin.log("error_add_contests_to_selector", e);
	}
};

rf_admin.get_qs = function (name) {
	try {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, ' '));
	} catch (e) {
		rf_admin.log("error_get_qs", e);
	}
};

rf_admin.update_order_of_entry_methods = function (em_in_order) {
	try {
		var set_priority = function set_priority(entry_method_id, position) {
			for (var i = 0; i < rf_admin.editable_entry_methods.length; i++) {
				if (String(rf_admin.editable_entry_methods[i].entry_method_id) === String(entry_method_id)) {
					console.log("set priority", entry_method_id, position);
					rf_admin.editable_entry_methods[i].priority = parseInt(position);
				}
			}
		};

		//sort the array
		var sortByKey = function sortByKey(array, key) {
			return array.sort(function (a, b) {
				var x = a[key];
				var y = b[key];
				return x < y ? -1 : x > y ? 1 : 0;
			});
		};

		console.log("old order", em_in_order, rf_admin.editable_entry_methods); //update the priority number

		for (var i = 0; i < em_in_order.length; i++) {
			set_priority(em_in_order[i].id, em_in_order[i].priority);
		}

		rf_admin.editable_entry_methods = sortByKey(rf_admin.editable_entry_methods, "priority");
		console.log("new order", rf_admin.editable_entry_methods);
		setTimeout(function () {
			rf_admin.update_frame_entry_methods();
		}, 100);
	} catch (e) {
		rf_admin.log("error_update_order_of_entry_methods", e);
	}
};

rf_admin.sell_entry_method = function (entry_type) {
	try {
		jQuery("#rf-contest-body-styler").hide();
		jQuery("#rf-entry-method-form-holder").show();

		for (var i = 0; i < rf_admin.entry_methods.length; i++) {
			if (String(entry_type) === String(rf_admin.entry_methods[i].entry_type_id)) {
				rf_admin.show_sell_em_screen(rf_admin.entry_methods[i]);
				return;
			}
		}
	} catch (e) {
		rf_admin.log("error_sell_entry_method", e);
	}
};

rf_admin.show_sell_em_screen = function (entry_method) {
	try {
		var cont = jQuery("#rf-entry-method-form-holder");
		var html = "<div class=\"sell-em animated fadeIn\">\n\t\t\t\t\t<h1>Upgrade to use ".concat(entry_method.entry_method_name, "</h1>\n\t\t\t\t\t<a href=\"#\" class=\"rf_buy_now btn mb-3 mb-4 btn-primary btn-block\">Upgrade now</a>\n\t\t\t\t\t<p>").concat(entry_method.description, "</p>\n\t\t\t\t\t<p><a href=\"").concat(entry_method.details_url, "?rf=wp-sem\" target=\"_blank\">Learn more about: ").concat(entry_method.entry_method_name, "</a></p>\n\t\t\t\t\t</div>");
		cont.html(html).show();
	} catch (e) {
		rf_admin.log("error_show_sell_em_screen", e);
	}
};

rf_admin.get_entry_method = function (entry_method_id) {
	try {
		for (var i = 0; i < rf_admin.editable_entry_methods.length; i++) {
			if (String(rf_admin.editable_entry_methods[i].entry_method_id) == String(entry_method_id)) return rf_admin.editable_entry_methods[i];
		}

		return false;
	} catch (e) {
		rf_admin.log("error_get_entry_method", e);
	}
};

rf_admin.update_frame_entry_methods = function () {
	console.log("update_frame_entry_methods", rf_admin.editable_entry_methods);
	rf_admin.send_to_frame({
		updated_entry_methods: rf_admin.editable_entry_methods,
		key: rf_wp_key
	});
};

rf_admin.update_in_page_entry_method_values = function (entry_method_data) {
	try {
		for (var i = 0; i < rf_admin.editable_entry_methods.length; i++) {
			if (String(entry_method_data.id) === String(rf_admin.editable_entry_methods[i].entry_method_id)) {
				rf_admin.editable_entry_methods[i][entry_method_data.field] = entry_method_data.v;
				rf_admin.update_frame_entry_methods();
				return;
			}
		}
	} catch (e) {
		rf_admin.log("error_update_in_page_entry_method_values", e);
	}
};

rf_admin.wys = function (elm, placeholder) {
	try {
		rf_admin.wys_counter++; //retries

		var changes = false;
		var edits = false;
		if (rf_admin.wys_counter > 5) return; //since we populate the form with js, we need to populate the elm with the form field

		if (!jQuery(elm).length) {
			setTimeout(function () {
				rf_admin.wys(elm, placeholder);
			}, 900);
			return;
		}

		rf_admin.wys_counter = 0;

		try {
			edits = jQuery(elm).data("edits");
			jQuery(elm).html(jQuery("[name='" + edits + "']").val());
			var toolbarOptions = [['bold', 'italic'], [{
				'indent': '-1'
			}, {
				'indent': '+1'
			}], [{
				'header': [1, 2, 3, 4, 5, 6, false]
			}], [{
				'color': []
			}, {
				'background': []
			}], // dropdown with defaults from theme
				[{
					'align': []
				}], ['link', 'video'], ['clean']];
			var quill = new Quill(elm, {
				theme: 'snow',
				placeholder: placeholder,
				modules: {
					toolbar: toolbarOptions
				}
			});
			quill.on('editor-change', function (eventName) {
				jQuery("[name='" + edits + "']").val(quill.root.innerHTML);
				changes = true;
			});
		} catch (e) {
			jQuery(elm).find(".ql-tooltip").remove();
			console.log("wys error", e);
		}

		setInterval(function () {
			if (changes && edits !== false) {
				changes = false;
				jQuery("[name='" + edits + "']").trigger("change");
			}
		}, 5000);
	} catch (e) {
		rf_admin.log("error_wys", e);
	}
};

rf_admin.get_contest_prizes = function () {
	try {
		jQuery.get(rf_api_url + "get_prizes/?c=" + rf_admin.active_contest_id + "&key=" + rf_wp_key, function (r) {
			rf_admin.prizes = r;
			rf_admin.layout_prizes();
		});
	} catch (e) {
		rf_admin.log("error_get_contest_prizes", e);
	}
};

rf_admin.layout_prizes = function () {
	try {
		var html = 'No prize(s) yet, <a href="#" class="rf-create-prize">click to create one</a>.';
		var cont = jQuery("#rf-existing-prizes");
		var elm = false;

		if (jQuery.isArray(rf_admin.prizes) && rf_admin.prizes.length > 0) {
			html = '';

			for (var i = 0; i < rf_admin.prizes.length; i++) {
				elm = rf_admin.prizes[i];
				html += "<button class=\"btn btn-elegant rf-edit-prize\" data-id=\"".concat(elm.prize_id, "\"><i class=\"fas fa-gifts\"></i> ").concat(elm.prize_name, "</button>");
			}
		}

		cont.html(html);
	} catch (e) {
		rf_admin.log("error_layout_prizes", e);
	}
};

rf_admin.submit_prize = function (form_data) {
	try {
		jQuery(".prize-loader").show(); //show loading

		jQuery(".rf-prize-form").hide();
		var url = rf_api_url + "submit_prize/";
		var pickers = JSON.stringify(rf_admin.prize_pickers);
		var formData = new FormData(form_data);
		formData.append("c", rf_admin.active_contest_id);
		formData.append("key", rf_wp_key);
		formData.append("pickers", pickers);
		jQuery.ajax({
			url: url,
			type: 'POST',
			data: formData,
			processData: false,
			// tell jQuery not to process the data
			contentType: false,
			// tell jQuery not to set contentType
			success: function success(r) {
				if (rf_admin.mode == "add") {
					if (jQuery.isArray(rf_admin.prizes)) {
						rf_admin.prizes.push(r);
					} else {
						rf_admin.prizes = [r];
					}

					rf_admin.layout_prizes();
				} else {
					for (var i = 0; i < rf_admin.prizes.length; i++) {
						if (String(r.prize_id) === String(rf_admin.prizes[i].prize_id)) {
							rf_admin.prizes[i] = r;
							break;
						}
					}

					rf_admin.layout_prizes();
				}

				setTimeout(function () {
					jQuery(".rf-edit-prize[data-id='" + r.prize_id + "']").animate_css("flash");
				}, 600);
				rf_admin.prep_prize_form("add");
			}
		});
	} catch (e) {
		rf_admin.log("error_submit_prize", e);
	}
};

rf_admin.make_color_picker = function () {
	try {
		var make_palette = function make_palette(color_data) {
			var band_html = "<div class=\"palette\">";
			color_data.color_band = JSON.parse(color_data.color_band);

			for (var i = 0; i < color_data.color_band.length; i++) {
				band_html += "<div class=\"palette_color\" style=\"background:".concat(color_data.color_band[i], ";\"></div>");
				if (i >= 4) break;
			}

			return band_html + "</div>";
		};

		jQuery.get("https://app.rewardsfuel.com/contests_v2/color_feed", function (r) {
			if (jQuery.isArray(r)) {
				var cont = jQuery("#rf-color-picker");
				jQuery.each(r, function (ind, elm) {
					cont.append("<button type=\"button\" class=\"list-group-item list-group-item-action browser-palette-colors palette_button\" data-id=\"".concat(elm.palette_id, "\">\n                     ").concat(make_palette(elm), "\n                 </button>"));

					if (ind == r.lenght - 1) {//todo mark selected
					}
				});
			}
		});
	} catch (e) {
		rf_admin.log("error_make_color_picker", e);
	}
};

rf_admin.get_embed_code = function (type) {
	try {
		var em_code = "https://r-f.page/" + rf_admin.active_contest.hexed_id;

		if (type == "wp") {
			em_code = "[RF_CONTEST contest='" + rf_admin.active_contest.hexed_id + "']";
		}

		if (type == "js") {
			em_code = '<a href="https://RewardsFuel.com/" class="rf_contest" data-id="' + rf_admin.active_contest.hexed_id + '">contest</a>\n' + '<script src="https://r-f.page/assets/js/embed_script.js" async></script>';
		}

		return em_code;
	} catch (e) {
		rf_admin.log("error_get_embed_code", e);
	}
};

rf_admin.get_hex = function (contest_id) {
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
};

rf_admin.mark_selected_color = function (selected_color, move_to_top) {
	try {
		if (!jQuery(".palette_color").length) {
			setTimeout(function () {
				rf_admin.mark_selected_color(selected_color, move_to_top);
			}, 500);
			return;
		} //jQuery(".palette_button i").remove();//remove old selected


		jQuery(".palette_button").removeClass("selected_palette");
		var selected_button = jQuery(".palette_button[data-id='" + selected_color + "']");
		selected_button.addClass("selected_palette");
		if (move_to_top) selected_button.parent().prepend(selected_button); //selected_button.prepend(`<i class="fas fa-angle-right"></i>`);
	} catch (e) {
		rf_admin.log("error_mark_selected_color", e);
	}
};

rf_admin.look_for_reg = function () {
	try {
		if (rf_wp_key.includes("SK") && location.hash.includes("#_rf_key=")) {
			var _new_key = location.hash.replace("#_rf_key=", ""); //show loading


			var _data6 = {
				'action': 'rf_ajax_handler',
				'update_rewards_fuel_api_key': _new_key
			};
			jQuery.post(ajaxurl, _data6, function () {
				if (rf_admin.get_cookie("_rf_activate_redirect") !== false) {
					var redirect = rf_admin.get_cookie("_rf_activate_redirect");
					rf_admin.set_cookie("_rf_activate_redirect", false, -1);

					if (_new_key.indexOf("SK") === -1) {
						redirect = rf_admin.update_qs_param(redirect, 'key', _new_key);
						window.location.href = redirect;
					}
				}

				if (rf_admin_location == "account") {
					window.location.reload();
				}

				if (rf_admin_location == "contest") {
					window.location.reload();
				}
			});
			location.hash = ""; //look for reload
		}
	} catch (e) {
		rf_admin.log("error_look_for_reg", e);
	}
};

rf_admin.mark_selected_font = function (selected_font) {
	try {
		if (!jQuery("#rf-contest-font-flipper option").length) {
			setTimeout(function () {
				rf_admin.mark_selected_font(selected_font);
			}, 500);
			return;
		}

		jQuery("#rf-contest-font-flipper").val(selected_font);
	} catch (e) {
		rf_admin.log("error_mark_selected_font", e);
	}
};

rf_admin.get_ch_data = function () {
	try {
		jQuery.get(rf_api_url + 'get_ch/?key=' + rf_wp_key, function (r) {
			jQuery(".contest_holder_name").html("".concat(r.first_name, " ").concat(r.last_name));
			jQuery(".plan_name").html("".concat(r.plan));
			if (r.pl == "Free") jQuery(".btn-upgrade").show();
		});
	} catch (e) {
		rf_admin.log("error_get_ch_data", e);
	}
}; //dashboard page


rf_admin.contestants_formatter = function (row, data) {
	try {
		return "<a href=\"#\" class=\"view_contestants\" data-id=\"".concat(data.contest_id, "\">").concat(data.contestants, "</a>");
	} catch (e) {
		rf_admin.log("error_contestants_formatter", e);
	}
};

rf_admin.contest_formatter = function (row, data) {
	return "<div class=\"contest-name-area\" id=\"contest-name-".concat(data.contest_id, "\">\n\t\t\t\t\t\t\t<div class=\"name\">").concat(data.name, "</div>\n\t\t\t\t\t\t\t<button class=\"embed-contest\" data-id=\"").concat(data.contest_id, "\">Share / Embed</button>\n\t\t\t\t\t\t\t<button class=\"visit-contest\" data-id=\"").concat(data.contest_id, "\">Visit hosted page</button>\n\t\t\t\t\t\t\t<button class=\"copy-contest\" data-id=\"").concat(data.contest_id, "\">Copy</button>\n\t\t\t\t\t\t\t<button class=\"edit-contest\" data-id=\"").concat(data.contest_id, "\">Edit</button>\n\t\t\t\t\t\t\t<button class=\"delete-contest\" data-id=\"").concat(data.contest_id, "\">Delete</button>\n\t\t\t\t\t\t\t<button class=\"stats-contest\" data-id=\"").concat(data.contest_id, "\">Stats</button>\n\t\t\t\t\t\t\t</div>");
};

rf_admin.status_formatter = function (row, data) {
	try {
		var scheduled = '';
		var schedule = 'Schedule';

		if (String(data.scheduled) === "1") {
			schedule = 'Edit schedule';
			if (data.status === "started" || data.status === "ready") scheduled = "starts: <span class='local_time' data-time=\"".concat(data.start_time, "\"></span>");
			if (data.status == "live") scheduled = "ends: <span class='local_time' data-time=\"".concat(data.end_time, "\"></span>");
		}

		var html = "<div class=\"contest-status-area\" id=\"contest-state-".concat(data.contest_id, "\">\n\t\t\t\t\t\t<div class=\"name\">").concat(data.status.replace("_", " "), " ").concat(scheduled, "</div> <button class=\"schedule-contest\" data-id=\"").concat(data.contest_id, "\">").concat(schedule, "</button>");

		if (data.status == "started" || data.status == "ready") {
			html += "<button class=\"change-status-contest\" data-status=\"live\" data-id=\"".concat(data.contest_id, "\">Start now</button>");
		}

		if (data.status == "live") {
			html += "<button class=\"change-status-contest\" data-status=\"paused\" data-id=\"".concat(data.contest_id, "\">Pause</button>\n\t\t\t\t\t\t<button class=\"change-status-contest\" data-status=\"completed\" data-id=\"").concat(data.contest_id, "\">End</button>");
		}

		if (data.status == "winner_pending" || data.status == "paused" || data.status == "completed") {
			html += "<button class=\"change-status-contest\" data-status=\"live\" data-id=\"".concat(data.contest_id, "\">Re-start</button>");
		}

		html += "\n\t\t\t\t\t</div>";
		return html;
	} catch (e) {
		rf_admin.log("error_status_formatter", e);
	}
};

rf_admin.init_contests_table = function () {
	try {
		jQuery("#rf-loader").show();
		jQuery('#rf-dashboard').hide();
		var table = jQuery('#contest-table');

		try {
			table.bootstrapTable('destroy');
		} catch (e) {
			console.log("destroy table er", e);
		}

		table.hide();
		table.bootstrapTable({
			url: rf_api_url + 'get_contests_for_dashboard/?key=' + rf_wp_key,
			//'/temp.json',
			pagination: true,
			search: true,
			pageList: [10, 25, 50, 100],
			columns: [{
				title: 'Contest',
				field: 'name',
				formatter: rf_admin.contest_formatter
			}, {
				field: 'status',
				title: 'Status',
				formatter: rf_admin.status_formatter
			}, {
				title: 'Entries',
				field: 'entries',
				sortable: true
			}, {
				title: 'Contestants',
				field: 'contestants',
				sortable: true,
				formatter: rf_admin.contestants_formatter
			}]
		});
		table.on('load-success.bs.table', function () {
			jQuery("#rf-loader").hide();
			jQuery('#rf-dashboard').show();
			rf_admin.format_local_times();
		});
	} catch (e) {
		rf_admin.log("error_init_contests_table", e);
	}
};

rf_admin.init_contestants_table = function () {
	try {
		jQuery('#contestants-table').bootstrapTable("destroy").bootstrapTable({
			url: rf_api_url + 'get_contestants/?c=' + rf_admin.active_contest_id + '&key=' + rf_wp_key,
			//'/temp.json',
			pagination: true,
			search: true,
			sidePagination: 'server'
		});
	} catch (e) {
		rf_admin.log("error_init_contestants_table", e);
	}
};

rf_admin.handle_scheduler = function () {
	try {
		jQuery("#popup_scheduler").html(jQuery("#schedule-area").html());
		rf_admin.prep_schedule_area();
	} catch (e) {
		rf_admin.log("error_handle_scheduler", e);
	}
};

rf_admin.format_local_times = function () {
	function time_converter(UNIX_timestamp) {
		var a = new Date(UNIX_timestamp * 1000);
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		return "".concat(month, "/").concat(date, "/").concat(year, "  ").concat(hour, ":").concat(min);
	}

	jQuery.each(jQuery(".local_time"), function (ind, elm) {
		jQuery(elm).html(time_converter(jQuery(this).data("time")));
	});
};

rf_admin.check_for_upgrades = function () {
	try {
		jQuery(".upgrade-button").attr("target", "_blank").attr("href", rf_api_url + 'upgrade/?key=' + rf_wp_key);
		if (rf_wp_key.includes("SK")) return false;
		jQuery.get(rf_api_url + "check_for_upgrade/?key=" + rf_wp_key, function (r) {
			if (r) {
				//todo add all un-paid removals (that are relavent)
				//hide buttons
				jQuery(".upgrade-button").hide();
			}
		});
	} catch (e) {
		rf_admin.log("error_check_for_upgrades", e);
	}
};

rf_admin.welcome_page = function () {
	try {
		if (location.hash.includes("welcome")) {
			if (rf_wp_key.includes("SK")) {
				location.hash = ""; //jQuery(``)
				//todo handle already logged in wp people
				//add iframe to see if they are already logged in and swap keys

				alertify.alert().set({
					'startMaximized': true,
					title: "",
					'label': 'Close',
					'message': jQuery("#rf-welcome-message").html(),
					onclose: function onclose() {
						jQuery("#rf-intro-video").remove();
					}
				}).show();
			}
		}
	} catch (e) {
		rf_admin.log("error_welcome_page", e);
	}
};

rf_admin.log = function (event, data) {
	var post_data = {
		'event': event,
		'data': data,
		'key': rf_wp_key,
		'url': window.location.href
	};
	jQuery.post(rf_api_url + 'wp_log', post_data);
};

rf_admin.update_qs_param = function (uri, key, value) {
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf('?') !== -1 ? "&" : "?";

	if (uri.match(re)) {
		return uri.replace(re, '$1' + key + "=" + value + '$2');
	} else {
		return uri + separator + key + "=" + value;
	}
};

jQuery(document).ready(function () {
	rf_admin.look_for_reg();
	setInterval(function () {
		jQuery(".rf-sign-in-google").attr("href", rf_api_url + "social_sign_in/?key=" + rf_wp_key + "&t=g&rd=" + window.location.href + "&url=" + site_url);
		jQuery(".rf-sign-in-twitter").attr("href", rf_api_url + "social_sign_in/?key=" + rf_wp_key + "&t=t&rd=" + window.location.href + "&url=" + site_url);
	}, 500);
	jQuery(".upgrade-link").attr("href", "https://rewardsfuel.com/pricing").attr("target", "_blank");
	rf_admin.init_listeners();
	rf_admin.get_upgrade_content();
	rf_admin.check_for_upgrades();
}); //common

String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
};

jQuery.fn.extend({
	animate_css: function animate_css(animationName, callback) {
		var animationEnd = function (el) {
			var animations = {
				animation: 'animationend',
				OAnimation: 'oAnimationEnd',
				MozAnimation: 'mozAnimationEnd',
				WebkitAnimation: 'webkitAnimationEnd'
			};

			for (var t in animations) {
				if (el.style[t] !== undefined) {
					return animations[t];
				}
			}
		}(document.createElement('div'));

		this.addClass('animated ' + animationName).one(animationEnd, function () {
			jQuery(this).removeClass('animated ' + animationName);
			if (String(_typeof(callback)) === "function") callback();
		});
		return this;
	}
});
