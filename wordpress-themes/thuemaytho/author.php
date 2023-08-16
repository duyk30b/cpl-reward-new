<?php get_header(); ?>
<?php
$posts_by_author = new WP_query(array(
    'author' => get_the_author_meta('ID'),
    'paged' => get_query_var('paged'),
    'order' => 'DESC',
    'orderby' => 'modified',
));
$total_post = $posts_by_author->found_posts;
$pagination = paginate_links(array(
    'base' => str_replace(99999, '%#%', esc_url(get_pagenum_link(99999))),
    'format' => '?paged=%#%',
    'total' => $posts_by_author->max_num_pages,
));
?>

<main>
    <section class="breakcrumb">
        <div class="container">
            <p class="breakcrumb-content">
                <a href="<?php bloginfo('siteurl'); ?>" rel="bookmark"> HOME </a>
                <span>Author</span>
                <span><?php echo get_the_author() ?></span>
            </p>
        </div>
    </section>

    <section class="author-page">
        <div class="container">
            <div class="author-inner">
                <h2 class="author-title">Tất cả bài viết của tác giả:
                    <span class="note"><?php echo get_the_author() ?></span>
                </h2>

                <div class="author-content">
                    <ul class="list-post-title">
                        <?php while ($posts_by_author->have_posts()) : $posts_by_author->the_post(); ?>
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