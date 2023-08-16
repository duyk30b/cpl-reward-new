<?php
# Use classic editor
add_filter('use_block_editor_for_post', '__return_false');

# Displays post image attachment (sizes: thumbnail, medium, full)
function get_first_image() {
   global $post;
   ob_start();
   ob_end_clean();

   $first_img = '';

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

#Xoa dau ngoac kep cong
remove_filter('the_content', 'wptexturize');
