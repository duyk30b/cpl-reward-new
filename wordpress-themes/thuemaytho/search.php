<?php get_header(); ?>

<main>
    <section class="breakcrumb">
        <div class="container">
            <p class="breakcrumb-content">
                <a href="<?php bloginfo('siteurl'); ?>" rel="bookmark"> HOME </a>
                <span>Search</span>
                <span><?php echo isset($_GET["s"]) ? esc_attr($_GET["s"])  : ''; ?></span>
            </p>
        </div>
    </section>

    <section>
        <div class="container">
            <div class="search-inner">
                <div class="searchform-wrap">
                    <form class="searchform" method="get" action="<?php bloginfo('home'); ?>">
                        <input class="search-input" name="s" id="s" type="text" placeholder="Type to seach ..." value="<?php echo isset($_GET["s"]) ? esc_attr($_GET["s"]) : ''; ?>" />
                        <input class="search-submit" type="submit" value="SEARCH" />
                    </form>
                </div>
                <h3 class="message">Các kết quả được tìm thấy: </h3>

                <div class="search-content">
                    <?php if (have_posts()) : ?>
                        <ul class="list-post-title">
                            <?php while (have_posts()) : the_post(); ?>
                                <li>
                                    <i class="circle-right-solid"></i>
                                    <a href="<?php the_permalink() ?>" rel="bookmark"><?php the_title(); ?></a>
                                </li>
                            <?php endwhile; ?>
                        </ul>
                    <?php else :
                        echo ("<p>Không có bài viết nào phù hợp với nội dung tìm kiếm.</p>"); ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>