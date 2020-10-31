<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress_sandbox' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '7&A3aJ{$z8j^hCdIk6`)1gp&~6m&Ub)#HdY2b+4zC ZizyQwJiY&2IjXmh{DcQb)' );
define( 'SECURE_AUTH_KEY',  '=i-xD (~(R|;|f^kPeZaam{6C6M *>FS,.b_.+7SAihRgnstWc97,#}&:@|YKr:U' );
define( 'LOGGED_IN_KEY',    'sRqHMM4d7ol$TAzk625<:-POEX:G0Ss=+T`dsL>b}5Z4O4VyyB(Ife10^2bQI1XF' );
define( 'NONCE_KEY',        'Pkhuf%jN5f=KHl=D?H`SfjqNb=: q7q/F0cRxqe*akB/(5(YA)jMWQK_36yl|hdn' );
define( 'AUTH_SALT',        'P91)J$.oP>/@p<0C6DRV,]#9&]tf,.I}4*iv%9ie,*EJ;H._/yQqX}[{cyxg9 `E' );
define( 'SECURE_AUTH_SALT', 'KwA^fm>ds8AA:X|6g{|,8mwUbEw1eQur*yuB;:.c3FcnJHOX BdsvH81. ci^^G=' );
define( 'LOGGED_IN_SALT',   'wBi ;U x/nCrEo;&M:ocV Ly_WJ0sw|$,RisY2L{<~ *_*T,<2.(.zp!j<!gs`5Y' );
define( 'NONCE_SALT',       '~1HW(0siH(n#uuthK[?&V=I_X3iJ+rsl4Oh`#iuYxs?@M_22b(jvI^3rQ`>/~d!P' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', true);

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
