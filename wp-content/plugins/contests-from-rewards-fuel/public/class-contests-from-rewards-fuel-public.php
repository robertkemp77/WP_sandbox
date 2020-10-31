<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://RewardsFuel.com
 * @since      2.0.1
 *
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 * enqueue the embed codes
 *
 * @package    Contests_From_Rewards_Fuel
 * @subpackage Contests_From_Rewards_Fuel/public
 * @author     Rewards Fuel LLC <info@rewardsfuel.com>
 */
class Contests_From_Rewards_Fuel_Public {
    //hook for changing short code to div



    /**
     * The ID of this plugin.
     *
     * @since    2.0.44
     * @access   private
     * @var      string    $plugin_name    The ID of this plugin.
     */
    private $plugin_name,$version;

    /**
     * Initialize the class and set its properties.
     *
     * @since    2.0.44
     * @param      string    $plugin_name       The name of the plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct( $plugin_name, $version ) {

        $this->plugin_name = $plugin_name;
        $this->version = $version;
        $this->enqueue_short_codes();

    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    2.0.44
     */
    public function enqueue_styles() {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Contests_From_Rewards_Fuel_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Contests_From_Rewards_Fuel_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */
        //wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/contests-from-rewards-fuel-public.css', array(), $this->version, 'all' );
    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since    2.0.44
     */
    public function enqueue_scripts() {

        /**
         * This function is provided for demonstration purposes only.
         *
         * An instance of this class should be passed to the run() function
         * defined in Contests_From_Rewards_Fuel_Loader as all of the hooks are defined
         * in that particular class.
         *
         * The Contests_From_Rewards_Fuel_Loader will then create the relationship
         * between the defined hooks and the functions defined in this
         * class.
         */

        wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/contests-from-rewards-fuel-public.js', array( 'jquery' ), $this->version, false );
        $this->enqueue_short_codes();
    }

    public function enqueue_short_codes(){
        try {
            add_shortcode('rf_contest', array($this, 'rf_embed_func'));
            add_shortcode('RF_CONTEST', array($this, 'rf_embed_func')); //old name - will remove shortly..

        }catch (Exception $e){
            //var_dump($e);
        }
    }

    function rf_embed_func($atts)
    {
        try {
            //$rf = New Rewards_Fuel();
            $contest_id = $atts['contest'];
            if (strpos($contest_id, 'C2') !== false) {
                if ( function_exists( 'ampforwp_is_amp_endpoint' ) && ampforwp_is_amp_endpoint() ) {
                    return "<amp-iframe width=\"200\" height=\"100\"
                            sandbox=\"allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox\"
                            layout=\"responsive\"
                            frameborder=\"0\"
                            src=\"https://r-f.page/$contest_id\" resizable>
                            <div overflow tabindex=0 role=button aria-label=\"\">Expand contest...</div>
                            <amp-img placeholder layout=\"fill\"
                              src=\"https://app.rewardsfuel.com/assets/images/amp_placeholder.svg\"></amp-img>
                        </amp-iframe>";
                }else{
                    return '<a href="https://RewardsFuel.com/" class="rf_contest" data-id="'.$contest_id.'">'. $this->rewards_fuel_get_random_link() .'</a>
                <script src="https://r-f.page/assets/js/embed_script.js" async></script>';
                }

            }
            if ( function_exists( 'ampforwp_is_amp_endpoint' ) && ampforwp_is_amp_endpoint() ) {
                return "<amp-iframe width=\"200\" height=\"100\"
                            sandbox=\"allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox\"
                            layout=\"responsive\"
                            frameborder=\"0\"
                            src=\"https://win.rewardsfuel.com/$contest_id\" resizable>
                            <div overflow tabindex=0 role=button aria-label=\"\">Expand contest...</div>
                            <amp-img placeholder layout=\"fill\"
                              src=\"https://app.rewardsfuel.com/assets/images/amp_placeholder.svg\"></amp-img>
                        </amp-iframe>";
            }else {
                $embed = $this->embed_js($contest_id);
                return ("$embed<a href='https://rewardsfuel.com' class='rewardsfuel-contest' data-contest-key='$contest_id'>" . $this->rewards_fuel_get_random_link() . "</a>");
            }
        } catch (Exception $e) {
            //$rf = new Rewards_Fuel();
            //$rf->exception_handler($e);
        }
    }

    private function rewards_fuel_get_random_link()
    {
        $tmp_array = array(
            0 => "Contest software - Reward Fuel",
            1 => "Social media contest software by Rewards Fuel",
            2 => "Instagram contests by Rewards Fuel",
            3 => "Facebook contests by Rewards Fuel",
            4 => "WordPress Contests by Rewards Fuel",
            5 => "Contest powered by Rewards Fuel",
            6 => "Rewards Fuel social media contests",
            7 => "Free contest software by Rewards Fuel",
            8 => "Twitter contests by Rewards Fuel",
            9 => "contest software",
            10 => "trade show contest"
        );
        $lucky_number = rand(0, 10);
        return $tmp_array[$lucky_number];
    }
    function embed_js($contest_id)
    {
        try {


            $js_embed = "<script type='text/javascript'>(function() { var se = document.createElement('script'); se.type = 'text/javascript'; se.async = true; se.src = '//cdn.rewardsfuel.com/embed_2.js'; var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(se, s); })(); </script>";
            $js_embed .= "<noscript><a href='//win.rewardsfuel.com/$contest_id'>Sorry you need JavaScript enabled to embed this contest.  Click here to visit the contest page.</a></noscript>";
            return $js_embed;
        } catch (Exception $e) {
            //$this->exception_handler($e);
        }
    }
}
