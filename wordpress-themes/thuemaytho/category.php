<?php get_header(); ?>

<?php
$cat_id = get_queried_object_id();

$cat_childs = get_categories(
    array('parent' => $cat_id, 'hide_empty' => 0, 'orderby' => 'id', 'order' => 'ASC')
);

$posts_in_page = new WP_query(array(
    'category__in' => array($cat_id),
    'paged' => get_query_var('paged'),
    'order' => 'DESC',
    'orderby' => 'modified',
));
$total_post = $posts_in_page->found_posts;
$pagination = paginate_links(array(
    'base' => str_replace(99999, '%#%', esc_url(get_pagenum_link(99999))),
    'format' => '?paged=%#%',
    'total' => $posts_in_page->max_num_pages,
));
?>

<main>
    <section class="breakcrumb">
        <div class="container">
            <p class="breakcrumb-content">
                <a href="<?php bloginfo('siteurl'); ?>" rel="bookmark"> HOME </a>
                <?php echo get_category_parents($cat_id, true, ''); ?>
            </p>
        </div>
    </section>
    <section class="category-page">
        <div class="container">
            <h1 class="category-title"><?php echo single_cat_title() ?></h1>

            <!-- Trường hợp là Category cha chứa nhiều Category con-->
            <?php if (!empty($cat_childs)) : ?>
                <div class="category-grid">
                    <?php foreach ($cat_childs as $cat) : ?>
                        <?php $recent = new WP_Query("showposts=6&cat=" . $cat->term_id . "&orderby=modified&order=DESC"); ?>
                        <article class="category-box">
                            <h2 class="category-title">
                                <a href="<?php echo get_category_link($cat->term_id); ?>" rel="bookmark">
                                    <?php echo $cat->name; ?>
                                </a>
                            </h2>
                            <div class="category-content">
                                <?php if ($recent->have_posts()) : $recent->the_post(); ?>
                                    <div class="post-detail-box">
                                        <a class="post-thumbnail" href="<?php the_permalink(); ?>">
                                            <img src="<?php echo get_first_image(); ?>" alt="<?php the_title(); ?>">
                                        </a>
                                        <div class="post-content">
                                            <h3 class="post-title">
                                                <a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
                                            </h3>
                                            <p class="post-excerpt"><?php echo substr(wp_strip_all_tags(get_the_content()), 0, 200); ?></p>
                                        </div>
                                    </div>
                                <?php endif; ?>
                                <div class="recent-post">
                                    <ul>
                                        <?php while ($recent->have_posts()) : $recent->the_post(); ?>
                                            <li>
                                                <i class="circle-right-solid"></i>
                                                <a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
                                            </li>
                                        <?php endwhile; ?>
                                    </ul>
                                </div>
                            </div>
                        </article>
                    <?php endforeach; ?>
                </div>

                <!-- Trường hợp là Category chỉ chứa các bài viết-->
            <?php elseif ($total_post != 0) : ?>
                <div class="category-grid">
                    <?php while ($posts_in_page->have_posts()) : $posts_in_page->the_post(); ?>
                        <div class="post-detail-box-wrap">
                            <article class="post-detail-box">
                                <a class="post-thumbnail" href="<?php the_permalink() ?>">
                                    <img src="<?php echo get_first_image(); ?>" alt="<?php the_title(); ?>">
                                </a>
                                <div class="post-content">
                                    <h3 class="post-title"><a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a></h3>
                                    <p class="post-excerpt"><?php echo substr(wp_strip_all_tags(get_the_content()), 0, 200); ?></p>
                                </div>
                            </article>
                        </div>
                    <?php endwhile; ?>
                </div>
                <div class="pagination"> <?php echo $pagination ?> </div>
            <?php endif; ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>