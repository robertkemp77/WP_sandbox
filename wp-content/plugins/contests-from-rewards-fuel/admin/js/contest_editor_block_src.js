if (String(typeof(_rf_block_editor)) === "undefined") {
    let _rf_block_editor = {};
    _rf_block_editor.init = function(){
        try {
            _rf_block_editor.el = wp.element.createElement;
            _rf_block_editor.contests = [_rf_block_editor.el("option", {value: ""}, "Loading contests...")];
            _rf_block_editor.icon = wp.element.createElement('svg', {
                    width: 20,
                    height: 20
                },
                wp.element.createElement('path',
                    {
                        fill: '#29557a',
                        d: "M10,0.892c0,0-5.918,7.337-5.918,11.888c0,8.439,11.836,8.439,11.836,0C15.918,8.229,10,0.892,10,0.892z\n" +
                        "\t\t\t M8.288,16.182c-0.13,0.185-0.337,0.285-0.541,0.285c-0.126,0-0.256-0.038-0.368-0.115c-1.195-0.823-1.707-2.188-1.702-3.541\n" +
                        "\t\t\tc0-1.1,0.32-2.234,0.902-3.218c0.185-0.307,0.585-0.414,0.892-0.229c0.31,0.187,0.412,0.584,0.23,0.895\n" +
                        "\t\t\tc-0.466,0.781-0.722,1.706-0.722,2.553c0.004,1.055,0.374,1.937,1.139,2.466C8.412,15.479,8.488,15.885,8.288,16.182z"
                    }
                )
            );
            _rf_block_editor.rf_block_editor = false;
            _rf_block_editor.rf_add_block_editor();
            _rf_block_editor.populate_contests();
        }catch(e){
            setTimeout(()=>{
                _rf_block_editor.init();
            },400);
        }
    };

    _rf_block_editor.populate_contests = function () {
        try {
            function convert(s) {
                let v, i, f = 0, a = [];
                s += '';
                f = s.length;
                for (i = 0; i < f; i++) {
                    a[i] = s.charCodeAt(i).toString(16).replace(/^([\da-f])$/, "0$1");
                }
                return a.join('');
            }

            let data = {
                'action': 'rf_ajax_handler',
                'get_contests': true
            };
            jQuery.post(ajaxurl, data, function (r) {
                if (jQuery.isArray(r) && r.length >= 1) {
                    rf_contests = [_rf_block_editor.el("option", {value: ""}, "Select a contest")];
                    let contest_name = '';
                    for (let i = 0; i < r.length; i++) {
                        contest_name = String(r[i].name);
                        if (contest_name.trim() === "" || contest_name === 'null')
                            contest_name = "Contest #" + r[i].contest_id;
                        _rf_block_editor.contests.push(_rf_block_editor.el("option", {value: "C2" + convert(r[i].contest_id)}, contest_name))
                    }
                } else {
                    _rf_block_editor.contests = [_rf_block_editor.el("option", {value: ""}, "No contests available")];
                    //todo add link to activation
                }
                _rf_block_editor.rf_block_editor.edit = _rf_block_editor.rf_block_edit;
                jQuery('.rf-contest-selector select').focus();
            });

        } catch (e) {
            _rf_contest.rf_error_log('rf_populate_contests', e);
        }
    };
    _rf_block_editor.rf_block_edit = function (props) {
        function update_contest_id(event) {
            props.setAttributes({contest_id: event.target.value});
        }

        return [_rf_block_editor.el('div', {
                className: 'rf-contest-selector'
            },
            _rf_block_editor.el('h1',
                {
                    className: 'rf-contest-title',
                },
                "Rewards Fuel Contest"
            ),
            _rf_block_editor.el(
                'select',
                {
                    onChange: update_contest_id,
                    value: props.attributes.contest_id,
                },
                _rf_block_editor.contests
            ),
            _rf_block_editor.el(
                'a',
                {
                    href:"admin.php?page=rewards_fuel_contests",
                    className: 'rf-settings-link',
                },
                "Contests & settings"
            )
        )];

    };
    _rf_block_editor.rf_add_block_editor = function () {
        if (_rf_block_editor.rf_block_editor === false) {
            _rf_block_editor.rf_block_editor = wp.blocks.registerBlockType('rewards-fuel-contests/contest-block', {
                title: 'Contest',
                icon: _rf_block_editor.icon,
                category: 'widgets', // Under which category the block would appear
                keywords: ['contest', 'sweepstakes', 'rewards fuel', 'game', 'giveaway'],
                attributes: {
                    contest_id: {
                        type: 'string'
                    }
                },
                edit: _rf_block_editor.rf_block_edit,
                save: function (props) {
                    return _rf_block_editor.el("div", null, _rf_block_editor.el("a", {
                        href: "https://RewardsFuel.com/",
                        class: "rf_contest",
                        "data-id": props.attributes.contest_id
                    }, "wordpress contest"), _rf_block_editor.el("script", {
                        src: "https://r-f.page/assets/js/embed_script.js",
                        async: true
                    }));
                }
            });
        }
    };
    _rf_block_editor.init();
}
