<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
    <link rel="icon" type="image/x-icon" href="<?php bloginfo('template_directory'); ?>/images/favicon.ico">
    <link rel="stylesheet" type="text/css" href="<?php bloginfo('stylesheet_url'); ?>" />
    	<!-- Google tag (gtag.js) - Google Analytics Ads -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-205398215-1">
	</script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'UA-205398215-1');
	</script>
</head>

<body>
    <header>
        <div class="header-top">
            <div class="container">
                <div class="collapse" id="button-collapse">
                    <i class="bars-solid"></i>
                </div>
                <div class="logo">
                    <a href="<?php bloginfo('siteurl'); ?>" rel="bookmark"> <span class="medi">MEDI</span><span class="home">HOME</span></p></a></li>
                </div>
                <nav class="menu" id="header-menu">
                    <ul>
                        <li class="cat-item"><a href="<?php bloginfo('siteurl'); ?>" rel="bookmark">Trang chủ</a></li>
                        <li class="cat-item">
                            <a>Dịch vụ</a>
                            <ul>
                                <?php wp_list_categories([
                                    'title_li' => '',
                                    'depth' => 2,
                                    'orderby' => 'id',
                                    'hide_empty' => false,
                                ]); ?> </ul>
                        </li>
                        <li class="cat-item"><a href="tel:0968100994" rel="bookmark">Liên hệ</a></li>
                    </ul>
                </nav>
                <div id="header-search">
                    <i class="magnifying-glass-solid"></i>
                    <div class="searchform-wrap">
                        <form class="searchform" method="get" action="<?php bloginfo('home'); ?>">
                            <input class="search-input" name="s" id="s" type="text" placeholder="Type to seach ..." value="<?php echo isset($_GET["s"]) ? esc_attr($_GET["s"]) : ''; ?>" />
                            <input class="search-submit" type="submit" value="SEARCH" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="banner">
            <div class="container">
                <p class="title">Máy thở, máy Oxy</p>
                <h1 class="description">Chuyên mua bán và cho thuê tại Hà Nội</h1>
                <p class="phone">
                    Liên hệ:
                    <span class="phone-item">0968100994</span>
                    hoặc
                    <span class="phone-item">0986.021.190</span>
                </p>
            </div>
        </div>
    </header>