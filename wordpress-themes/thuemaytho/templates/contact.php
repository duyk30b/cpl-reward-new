<?php
/*
 Template Name: Contact
 */
?>
<?php get_header(); ?>

<main>
    <section class="breakcrumb">
        <div class="container">
            <p class="breakcrumb-content">
                <a href="<?php bloginfo('siteurl'); ?>" rel="bookmark"> HOME </a>
                <span>Contact Page</span>
            </p>
        </div>
    </section>

    <section>
        <div class="container">
            <?php get_search_form();  ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>