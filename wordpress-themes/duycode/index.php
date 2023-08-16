<?php get_header(); ?>
<?php
$cat_root = get_categories([
	'hide_empty' => 0,
	'orderby' => 'title',
	'order' => 'ASC',
	'parent' => 0,
]);
?>

<main>
	<div class="container">
		<div class="home-page">
			<div class="category-grid">
				<?php foreach ($cat_root as $cat) : ?>
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
										<p class="post-excerpt"><?php echo substr(wp_strip_all_tags(get_the_content()), 0, 200); ?></p>
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
		</div>

	</div>
</main>

<?php get_footer(); ?>