<?php get_header(); ?>
<?php
$tag_id = get_queried_object()->term_id;
$posts_in_tag = new WP_query(array(
    'tag_id' => $tag_id,
    'paged' => get_query_var('paged'),
    'order' => 'DESC',
    'orderby' => 'modified',
));
$total_post = $posts_in_tag->found_posts;
$pagination = paginate_links(array(
    'base' => str_replace(99999, '%#%', esc_url(get_pagenum_link(99999))),
    'format' => '?paged=%#%',
    'total' => $posts_in_tag->max_num_pages,
));
?>

<main>
    <section class="breakcrumb">
        <div class="container">
            <p class="breakcrumb-content">
                <a href="<?php bloginfo('siteurl'); ?>" rel="bookmark"> HOME </a>
                <span>Tags</span>
                <span><?php echo single_tag_title() ?></span>
            </p>
        </div>
    </section>

    <section class="archive-page">
        <div class="container">
            <div class="archive-inner">
                <h2 class="archive-title">Tất cả bài viết liên quan đến:
                    <span class="note"><?php echo single_tag_title() ?></span>
                </h2>

                <div class="archive-content">
                    <ul class="list-post-title">
                        <?php while ($posts_in_tag->have_posts()) : $posts_in_tag->the_post(); ?>
                            <li>
                                <i class="circle-right-solid"></i>
                                <a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
                            </li>
                        <?php endwhile; ?>
                    </ul>
                </div>
                <div class="pagination"> <?php echo $pagination ?> </div>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>