<?php get_header(); ?>

<main>
    <section class="breakcrumb">
        <div class="container">
            <p class="breakcrumb-content">
                <a href="<?php bloginfo('siteurl'); ?>" rel="bookmark"> HOME </a>
                <span>404 Page</span>
            </p>
        </div>
    </section>

    <section class="notfound-page">
        <div class="container">
            <div class="notfound-inner">
                <p class="number">404</p>
                <p class="message">Thông tin bạn tìm có vẻ không đúng lắm </p>
                <p class="advice">Bạn có thể tìm thêm thông tin khác tại đây</p>

                <div class="searchform-wrap">
                    <form class="searchform" method="get" action="<?php bloginfo('home'); ?>">
                        <input class="search-input" name="s" id="s" type="text" placeholder="Type to seach ..." value="<?php echo isset($_GET["s"]) ? esc_attr($_GET["s"]) : ''; ?>" />
                        <input class="search-submit" type="submit" value="SEARCH" />
                    </form>
                </div>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>