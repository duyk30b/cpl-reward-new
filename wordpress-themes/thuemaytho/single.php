<?php get_header(); ?>

<?php
$category = get_the_category()[0];
$category_id = $category->cat_ID;
$posts_same_category = new wp_query(array(
    'category__in' => $category_id,
    'post__not_in' => array(get_the_ID()),
    'posts_per_page' => 5,
));

$tag_ids = array();
$tags = wp_get_post_tags(get_the_ID());
foreach ($tags as $tag) $tag_ids[] = $tag->term_id;
$posts_same_tags = new wp_query(array(
    'tag__in' => $tag_ids,
    'post__not_in' => array(get_the_ID()),
    'posts_per_page' => 5,
));
?>

<main>
    <section class="breakcrumb">
        <div class="container">
            <p class="breakcrumb-content">
                <a href="<?php bloginfo('siteurl'); ?>" rel="bookmark"> HOME </a>
                <?php echo get_category_parents($category_id, true, ''); ?>
                <span><?php echo get_the_title(); ?></span>
            </p>
        </div>
    </section>
    <section class="post-page">
        <div class="container">
            <article class="inner">
                <h1 class="post-title"> <?php echo get_the_title(); ?></h1>
                <p class="post-meta">
                    Tác giả:
                    <a href="<?php echo get_author_posts_url($post->post_author); ?>" rel="bookmark">
                        <i class="user-solid"></i>
                        <?php echo get_the_author_meta('display_name', $post->post_author); ?>
                    </a>
                    - Ngày đăng: <i class="calendar-regular"></i> <?php the_modified_date('d/m/y') ?>
                    - <?php edit_post_link('Edit <i class="pen-to-square-solid"></i> '); ?>
                </p>
                <hr />
                <div class="post-content">
                    <?php echo get_the_content(); ?>
                </div>
                <hr />
                <div class="post-tags">
                    <p>
                        <span>All Tags <i class="tag-solid"></i>: </span>
                        <?php if (has_tag()) : ?>
                            <?php echo get_the_tag_list(); // Display tags as links 
                            ?>
                        <?php endif; ?>
                    </p>

                </div>
            </article>
            <aside class="post-sidebar">
                <div class="sidebar-box">
                    <h2 class="sidebar-title">Có thể bạn quan tâm</h2>
                    <div class="sidebar-content">
                        <?php while ($posts_same_tags->have_posts()) : $posts_same_tags->the_post(); ?>
                            <div class="post-box-simple">
                                <a href="<?php the_permalink() ?>" class="post-thumbnail" rel="bookmark">
                                    <img src="<?php echo get_first_image(); ?>" alt="<?php the_title(); ?>">
                                </a>
                                <h3 class="post-title">
                                    <a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
                                </h3>
                            </div>
                        <?php endwhile; ?>
                    </div>
                </div>
                <div class="sidebar-box">
                    <h2 class="sidebar-title">Bài viết cùng chuyên mục</h2>
                    <div class="sidebar-content">
                        <?php while ($posts_same_category->have_posts()) : $posts_same_category->the_post(); ?>
                            <div class="post-box-simple">
                                <a class="post-thumbnail" href="<?php the_permalink() ?>">
                                    <img src="<?php echo get_first_image(); ?>" alt="<?php the_title(); ?>">
                                </a>
                                <h3 class="post-title">
                                    <a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
                                </h3>
                            </div>
                        <?php endwhile; ?>
                    </div>
                </div>
            </aside>
        </div>
    </section>
</main>

<?php get_footer(); ?>