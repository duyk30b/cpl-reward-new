<?php get_header(); ?>

<?php
$category = get_the_category()[0];
$category_id = $category->cat_ID;
$category_link = get_category_link($category);
$category_name = $category->cat_name;

$query_one = new WP_Query("showposts=1&orderby=rand&cat=" . $category_id);
$query_list = new WP_query(array('category__in' => array($category_id), 'posts_per_page' => 50, 'order' => 'ASC'));

$post_ID = get_the_ID();
?>

<main>
    <div class="container">
        <div class="post-grid">
            <div class="post-inner">
                <h1 class="post-title"> <?php echo get_the_title(); ?></h1>
                <div class="post-meta">
                    Tác giả:
                    <a href="<?php echo get_author_posts_url($post->post_author); ?>" rel="bookmark">
                        <i class="user-solid"></i>
                        <?php echo get_the_author_meta('display_name', $post->post_author); ?>
                    </a>
                    - Ngày đăng: <i class="calendar-regular"></i> <?php the_modified_date('d/m/y') ?>
                    - <?php edit_post_link('Edit <i class="pen-to-square-solid"></i> '); ?>
                </div>
                <div class="post-content">
                    <?php the_content('Read more...'); ?>
                </div>
                
                <div class="fb-comments" xid="<?php the_ID(); ?>" data-numposts="20" data-colorscheme="light" data-version="v2.3"></div>
            </div>
            <div class="post-relate">
                <div class="category-box">
                    <h2 class="category-title">
                        <a href="<?php echo $category_link; ?>"><?php echo $category_name; ?></a>
                    </h2>
                    <div class="category-content">
                        <div class="post-detail-box">
                            <?php while ($query_one->have_posts()) : $query_one->the_post(); ?>
                                <a class="post-thumbnail" href="<?php the_permalink(); ?>">
                                    <img src="<?php echo get_first_image(); ?>" alt="">
                                </a>
                                <div class="post-content">
                                    <h3 class="post-title">
                                        <a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
                                    </h3>
                                </div>
                            <?php endwhile; ?>
                        </div>

                        <div class="recent-post">
                            <ul>
                                <?php while ($query_list->have_posts()) : $query_list->the_post(); ?>
                                    <?php $current_post_style = "";
                                    if (get_the_ID() == $post_ID) :
                                        $current_post_style = "color: #f44336";
                                    endif
                                    ?>
                                    <li>
                                        <img src="<?php bloginfo('template_directory'); ?>/images/arrow.gif">
                                        <a style="<?php echo $current_post_style ?>" href="<?php the_permalink() ?>" rel="bookmark">
                                            <?php the_title(); ?>
                                        </a>
                                    </li>
                                <?php endwhile; ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>