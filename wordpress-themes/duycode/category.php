<?php get_header(); ?>

<?php
$current_cat_id = get_cat_id(single_cat_title("", false));
$cat_childs = get_categories(
    array('parent' => $current_cat_id, 'hide_empty' => 0, 'orderby' => 'id', 'order' => 'ASC',)
);

$posts_all = new WP_Query(array('category__in' => array($current_cat_id)));
$posts_in_page = new WP_query(array('category__in' => array($current_cat_id), 'paged' => get_query_var('paged')));
$total_post = $posts_all->found_posts;

$pagination = paginate_links(array(
    'base' => str_replace(99999, '%#%', esc_url(get_pagenum_link(99999))),
    'format' => '?paged=%#%',
    'total' => $posts_in_page->max_num_pages,
));
?>

<main>
    <div class="container">
        <?php if ($total_post != 0) { ?>
            <div class="category-box">
                <h2 class="category-title">
                    <a><?php echo single_cat_title() . " - " . $total_post . " Posts" ?></a>
                </h2>
                <div class="category-content">
                    <div class="post-detail-box">
                        <?php if ($posts_in_page->have_posts()) : $posts_in_page->the_post(); ?>
                            <a class="post-thumbnail" href="<?php the_permalink(); ?>">
                                <img src="<?php echo get_first_image(); ?>" alt="<?php the_title(); ?>">
                            </a>
                            <div class="post-content">
                                <h3 class="post-title">
                                    <a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
                                </h3>
                                <p class="post-excerpt"><?php echo substr(wp_strip_all_tags(get_the_content()), 0, 200); ?></p>
                            </div>
                        <?php endif; ?>
                    </div>
                    <div class="recent-post">
                        <ul>
                            <?php while ($posts_in_page->have_posts()) : $posts_in_page->the_post(); ?>
                                <li>
                                    <img src="<?php bloginfo('template_directory'); ?>/images/arrow.gif">
                                    <a href="<?php the_permalink() ?>" rel="bookmark">
                                        <?php the_title(); ?>
                                    </a>
                                </li>
                            <?php endwhile; ?>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="pagination"> <?php echo $pagination ?> </div>
        <?php } ?>

        <?php if (!empty($cat_childs)) : ?>
            <div class="category-grid">
                <?php foreach ($cat_childs as $cat) : ?>
                    <?php $recent = new WP_Query("showposts=6&cat=" . $cat->term_id . "&orderby=modified&order=DESC"); ?>
                    <div class="category-box">
                        <h2 class="category-title">
                            <a href="<?php echo get_category_link($cat->term_id); ?>"><?php echo $cat->name; ?></a>
                        </h2>
                        <div class="category-content">
                            <div class="post-detail-box">
                                <?php if ($recent->have_posts()) : $recent->the_post(); ?>
                                    <a class="post-thumbnail" href="<?php the_permalink(); ?>">
                                        <img src="<?php echo get_first_image(); ?>" alt="<?php the_title(); ?>">
                                    </a>
                                    <div class="post-content">
                                        <h3 class="post-title">
                                            <a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
                                        </h3>
                                    </div>
                                <?php endif; ?>
                            </div>
                            <div class="recent-post">
                                <ul>
                                    <?php while ($recent->have_posts()) : $recent->the_post(); ?>
                                        <li>
                                            <img src="<?php bloginfo('template_directory'); ?>/images/arrow.gif">
                                            <a href="<?php the_permalink() ?>" rel="bookmark">
                                                <?php the_title(); ?>
                                            </a>
                                        </li>
                                    <?php endwhile; ?>
                                </ul>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

    </div>
</main>

<?php get_footer(); ?>