<?php
# Add Page Theme Settings Page
include("settings.php");

# Use classic editor
add_filter('use_block_editor_for_post', '__return_false');

# Don't replace " " to ” ”
remove_filter('the_content', 'wptexturize');

# Enable post thumbnail
add_theme_support('post-thumbnails');

#  wp_head() in <head> have <title>
add_theme_support('title-tag');

# Get first image in post
function get_first_image() {
    global $post;
    ob_start();
    ob_end_clean();

    $first_img = '';
    if (empty($first_img)) {
        preg_match('/<img.+thumbnail=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches_thumbnail);
        if (!empty($matches_thumbnail[1])) {
            $first_img = $matches_thumbnail[1];
        }
    }
    if (empty($first_img)) {
        preg_match('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches_src);
        if (!empty($matches_src)) {
            $first_img = $matches_src[1];
        }
    }
    if (empty($first_img)) {
        $first_img = bloginfo('template_directory') . "/images/no-image.gif";
    }
    return $first_img;
}

if (!class_exists('DuyCode_Login_Manager')) {
    class DuyCode_Login_Manager {
        var $failed_login_limit = 3;                    // Số lần login thất bại
        var $lockout_duration   = 60 * 30;              // Thòi gian cấm login tính theo giây.
        var $transient_name     = 'attempted_login';    // Tên lưu cache

        public function __construct() {
            add_filter('authenticate', array($this, 'check_attempted_login'), 30, 3);
            add_action('wp_login_failed', array($this, 'login_failed'), 10, 1);
        }

        public function check_attempted_login($user, $username, $password) {
            if (get_transient($this->transient_name)) {
                $datas = get_transient($this->transient_name);

                // Lỗi nếu số lần thất bại lớn hơn số lần đã quy định 
                if ($datas['tried'] >= $this->failed_login_limit) {
                    $until = get_option('_transient_timeout_' . $this->transient_name);
                    $time = $this->when($until);
                    return new WP_Error('too_many_tried', sprintf(__('<strong>Error</strong>: Too many failed login attempts. Please try again in %1$s.'), $time));
                }
            }
            return $user;
        }


        public function login_failed($username) {
            // Bật lại đoạn sau nếu cần reset lại cache
            // set_transient($this->transient_name, ['tried' => 1], $this->lockout_duration);

            if (get_transient($this->transient_name)) {
                $datas = get_transient($this->transient_name);

                // Nếu số lần thất bại chưa đủ sẽ được cập nhật
                if ($datas['tried'] < $this->failed_login_limit) {
                    $datas['tried']++;
                    set_transient($this->transient_name, $datas, $this->lockout_duration);
                }
            } else {
                set_transient($this->transient_name, ['tried' => 1], $this->lockout_duration);
            }
        }

        /**
         * Return difference between 2 given dates
         * @param  int      $time   Date as Unix timestamp
         * @return string           Return string
         */
        private function when($time) {
            if (!$time)
                return;
            $diff = abs(time() - $time);
            $second = 1;
            $minute = $second * 60;
            $hour = $minute * 60;
            $day = $hour * 24;
            if ($diff < $minute)
                return $diff . ' seconds';
            if ($diff < $hour)
                return ceil($diff / $minute) . ' minutes';
            if ($diff < $day)
                return ceil($diff / $hour) . ' hours';
            return ceil($diff / $day) . ' days';
        }
    }
}

new DuyCode_Login_Manager();
