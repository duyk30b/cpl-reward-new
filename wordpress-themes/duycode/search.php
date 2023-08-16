<?php get_header(); ?>

<main>
	<div class="container">
		<div class="search-inner">
			<?php if (have_posts()) : ?>
				<h3>Các kết quả được tìm thấy:</h3>
				<ul>
					<?php while (have_posts()) : the_post(); ?>
						<li id="post-<?php the_ID(); ?>">
							<a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
								<img src="<?php bloginfo('template_directory'); ?>/images/arrow.gif">
								<?php the_title(); ?><?php edit_post_link('Edit', ' [ ', ' ] '); ?>
							</a>
						</li>

					<?php endwhile; ?>
				</ul>
			<?php else : ?>
				<h3>Không có kết quả nào được tìm thấy.</h3>
			<?php endif; ?>
		</div>
	</div>
</main>

<?php get_footer(); ?>