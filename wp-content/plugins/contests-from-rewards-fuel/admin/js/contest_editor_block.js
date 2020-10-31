function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

if (String(typeof _rf_block_editor === "undefined" ? "undefined" : _typeof(_rf_block_editor)) === "undefined") {
    var _rf_block_editor2 = {};

    _rf_block_editor2.init = function () {
        try {
            _rf_block_editor2.el = wp.element.createElement;
            _rf_block_editor2.contests = [_rf_block_editor2.el("option", {
                value: ""
            }, "Loading contests...")];
            _rf_block_editor2.icon = wp.element.createElement('svg', {
                width: 20,
                height: 20
            }, wp.element.createElement('path', {
                fill: '#29557a',
                d: "M10,0.892c0,0-5.918,7.337-5.918,11.888c0,8.439,11.836,8.439,11.836,0C15.918,8.229,10,0.892,10,0.892z\n" + "\t\t\t M8.288,16.182c-0.13,0.185-0.337,0.285-0.541,0.285c-0.126,0-0.256-0.038-0.368-0.115c-1.195-0.823-1.707-2.188-1.702-3.541\n" + "\t\t\tc0-1.1,0.32-2.234,0.902-3.218c0.185-0.307,0.585-0.414,0.892-0.229c0.31,0.187,0.412,0.584,0.23,0.895\n" + "\t\t\tc-0.466,0.781-0.722,1.706-0.722,2.553c0.004,1.055,0.374,1.937,1.139,2.466C8.412,15.479,8.488,15.885,8.288,16.182z"
            }));
            _rf_block_editor2.rf_block_editor = false;

            _rf_block_editor2.rf_add_block_editor();

            _rf_block_editor2.populate_contests();
        } catch (e) {
            setTimeout(function () {
                _rf_block_editor2.init();
            }, 400);
        }
    };

    _rf_block_editor2.populate_contests = function () {
        try {
            var convert = function convert(s) {
                var v,
                    i,
                    f = 0,
                    a = [];
                s += '';
                f = s.length;

                for (i = 0; i < f; i++) {
                    a[i] = s.charCodeAt(i).toString(16).replace(/^([\da-f])$/, "0$1");
                }

                return a.join('');
            };

            var data = {
                'action': 'rf_ajax_handler',
                'get_contests': true
            };
            jQuery.post(ajaxurl, data, function (r) {
                if (jQuery.isArray(r) && r.length >= 1) {
                    rf_contests = [_rf_block_editor2.el("option", {
                        value: ""
                    }, "Select a contest")];
                    _rf_block_editor2.contests = [_rf_block_editor2.el("option", {
                        value: ""
                    }, "Select a contest")];
                    var contest_name = '';

                    for (var i = 0; i < r.length; i++) {
                        contest_name = String(r[i].name);
                        if (contest_name.trim() === "" || contest_name === 'null') contest_name = "Contest #" + r[i].contest_id;

                        _rf_block_editor2.contests.push(_rf_block_editor2.el("option", {
                            value: "C2" + convert(r[i].contest_id)
                        }, contest_name));
                    }
                } else {
                    _rf_block_editor2.contests = [_rf_block_editor2.el("option", {
                        value: ""
                    }, "No contests available")]; //todo add link to activation
                }

                _rf_block_editor2.rf_block_editor.edit = _rf_block_editor2.rf_block_edit;
                jQuery('.rf-contest-selector select').focus();
            });
        } catch (e) {
            _rf_contest.rf_error_log('rf_populate_contests', e);
        }
    };

    _rf_block_editor2.rf_block_edit = function (props) {
        function update_contest_id(event) {
            props.setAttributes({
                contest_id: event.target.value
            });
        }

        return [_rf_block_editor2.el('div', {
            className: 'rf-contest-selector'
        }, _rf_block_editor2.el('h1', {
            className: 'rf-contest-title'
        }, "Rewards Fuel Contest"), _rf_block_editor2.el('select', {
            onChange: update_contest_id,
            value: props.attributes.contest_id
        }, _rf_block_editor2.contests), _rf_block_editor2.el('a', {
            href: "options-general.php?page=rewards_fuel_contests",
            className: 'rf-settings-link'
        }, "Add or edit contests"))];
    };

    _rf_block_editor2.rf_add_block_editor = function () {
        if (_rf_block_editor2.rf_block_editor === false) {
            _rf_block_editor2.rf_block_editor = wp.blocks.registerBlockType('rewards-fuel-contests/contest-block', {
                title: 'Contest',
                icon: _rf_block_editor2.icon,
                category: 'widgets',
                // Under which category the block would appear
                keywords: ['contest', 'sweepstakes', 'rewards fuel', 'game', 'giveaway'],
                attributes: {
                    contest_id: {
                        type: 'string'
                    }
                },
                edit: _rf_block_editor2.rf_block_edit,
                save: function save(props) {
                    return _rf_block_editor2.el("div", null, _rf_block_editor2.el("a", {
                        href: "https://RewardsFuel.com/",
                        class: "rf_contest",
                        "data-id": props.attributes.contest_id
                    }, "wordpress contest"), _rf_block_editor2.el("script", {
                        src: "https://r-f.page/assets/js/embed_script.js",
                        async: true
                    }));
                }
            });
        }
    };

    _rf_block_editor2.init();
}
