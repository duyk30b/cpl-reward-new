<footer>
    <?php wp_footer(); ?>
    <div class="container">
        <div class="contact">
            <h3>Liên hệ</h3>
            <ul>
                <li>
                    <i class="phone-solid" style="color:#555"></i>
                    <a href="tel:0986021190" rel="bookmark">0986.021.190</a>
                </li>
                <li>
                    <i class="envelope-solid" style="color:#555"></i>
                    <a href="mailto: medihome.vn@gmail.com" rel="bookmark">medihome.vn@gmail.com</a>
                </li>
                <li>
                    <i class="location-dot-solid" style="color:#555"></i>
                    <a href="https://goo.gl/maps/RETd5ks3K5iKvgii6" target="_blank" rel="bookmark">Số 8, Thạch Bàn, Long Biên, Hà Nội</a>
                </li>
            </ul>
        </div>
        <div class="serive">
            <h3>Dịch vụ</h3>
            <ul>
                <li>
                    <i class="caret-right-solid" style="color:#555"></i>
                    <a href="<?php echo get_option('__dtd_maytho') ?>" rel="bookmark">Thuê Máy Thở</a>
                </li>
                <li>
                    <i class="caret-right-solid" style="color:#555"></i>
                    <a href="<?php echo get_option('__dtd_chamsoc') ?>" rel="bookmark">Chăm sóc tại nhà</a>
                </li>
                <li>
                    <i class="caret-right-solid" style="color:#555"></i>
                    <a href="<?php echo get_option('__dtd_benhnhan') ?>" rel="bookmark">Danh sách bệnh nhân</a>
                </li>
            </ul>
        </div>
        <div class="address">
            <h3>Mạng xã hội</h3>
            <ul>
                <li>
                    <i class="brand-facebook" style="color:#295396"></i>
                    <a href="<?php echo get_option('__dtd_facebook_link') ?>" target="_blank" rel="bookmark">Facebook</a>
                </li>
                <li>
                    <i class="brand-messenger" style="color:#295396"></i>
                    <a href="<?php echo get_option('__dtd_messenger_link') ?>" target="_blank" rel="bookmark">Messenger</a>
                </li>
                <li>
                    <i class="brand-zalo"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i>
                    <a href="<?php echo get_option('__dtd_zalo_link') ?>" target="_blank" rel="bookmark">Zalo</a>
                </li>
            </ul>
        </div>
    </div>
</footer>

<div class="telephone-ring mobile">
    <div class="phone">
        <div class="wrap">
            <a class="image" href="tel:<?php echo get_option('__dtd_phone_number') ?>">
                <i class="phone-solid"></i>
            </a>
        </div>
        <div class="ring"></div>
    </div>
    <a class="number" href="tel:<?php echo get_option('__dtd_phone_number') ?>"><?php echo get_option('__dtd_phone_number') ?></a>
</div>

<div class="telephone-ring zalo">
    <div class="phone">
        <div class="wrap">
            <a class="image" href="<?php echo get_option('__dtd_zalo_link') ?>" target="_blank">
                <i class="brand-zalo"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i>
            </a>
        </div>
        <div class="ring"></div>
    </div>
</div>

<div class="modal" id="modal-image-root">
    <img loading="lazy" src="">
</div>
<script>
    window.addEventListener('click', e => {
        // nếu click vào ảnh có root và không phải thumbnail thì hiện modal
        if (e.target.closest('img') && e.target.getAttribute("root") && !e.target.closest('.post-thumbnail')) {
            console.log("openm =")
            const modal = document.getElementById('modal-image-root')
            const img = modal.querySelector("img")

            modal.classList.add('show')
            img.src = e.target.getAttribute("root")
        } else { // còn lại click vào đâu cũng ẩn modal
            document.getElementById('modal-image-root').classList.remove('show')
        }
    })

    window.addEventListener('click', e => {
        // nếu click vào collapse thì hiện Left Navigation Bar
        if (e.target.closest('#button-collapse')) {
            document.getElementById('header-menu').classList.add('mobile-show')
        } else { // còn lại click vào đâu cũng ẩn LNB
            document.getElementById('header-menu').classList.remove('mobile-show')
        }
    })


    window.addEventListener('click', e => {
        // nếu click vào vùng ô Search thì hiển thị ô search
        if (e.target.closest('#header-search')) {
            document.getElementById('header-search').classList.add('search-show')
        } else { // còn lại click vào đâu cũng ẩn ô search
            document.getElementById('header-search').classList.remove('search-show')
        }
    })
</script>
</body>

</html>