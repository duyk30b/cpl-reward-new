<?php
# Đây là giá trị mặc định
$prefix = "__dtd_";
$options_example = [
    ['id' => $prefix . 'phone_number', 'default' => '0968.100.994'],
    ['id' => $prefix . 'zalo_link', 'default' => 'https://zalo.me/0968100994'],
    ['id' => $prefix . 'facebook_link', 'default' => 'https://www.facebook.com/chamsocviet.fanpage'],
    ['id' => $prefix . 'messenger_link', 'default' => 'https://www.facebook.com/bs.buitrang'],
    ['id' => $prefix . 'maytho', 'default' => './category/thue-may-tho-tai-nha/'],
    ['id' => $prefix . 'chamsoc', 'default' => './category/cham-soc-tai-nha/'],
    ['id' => $prefix . 'mayoxy', 'default' => './thue-may-tho-tai-nha/thue-may-tao-oxy-tai-nha-o-ha-noi/'],
    ['id' => $prefix . 'tuvan', 'default' => './category/cham-soc-tai-nha/'],
    ['id' => $prefix . 'benhnhan', 'default' => './category/cham-soc-tai-nha/'],
];
$options_all = wp_load_alloptions();

add_action('admin_menu', 'duycode_add_admin_menu');

function duycode_add_admin_menu() {
    global $prefix, $options_example, $options_all;

    if (isset($_REQUEST['action']) && $_REQUEST['action'] == 'duycode_create_option') {
        if (isset($_REQUEST['id']) && isset($_REQUEST['default'])) {
            update_option($prefix . $_REQUEST['id'], $_REQUEST['default']);
        }
        header('Location: themes.php?page=' . basename(__FILE__) . '&duycode_create_option=true');
        die;
    }

    // không sử dụng 'action' = 'update' vì conflict với wordpress
    if (isset($_REQUEST['action']) && $_REQUEST['action'] == 'duycode_update_option') {
        foreach ($options_all as $name => $value) {
            if (str_contains($name, $prefix)) {
                if (isset($_REQUEST[$name])) {
                    update_option($name, $_REQUEST[$name]);
                } else {
                    delete_option($name);
                }
            }
        }
        header('Location: themes.php?page=' . basename(__FILE__) . '&duycode_update_option=true');
        die;
    }

    if (isset($_REQUEST['action']) && $_REQUEST['action'] == 'duycode_delete_option') {
        if (isset($_REQUEST['id'])) {
            delete_option($_REQUEST['id']);
        }
        header('Location: themes.php?page=' . basename(__FILE__) . '&duycode_delete_option=true');
        die;
    }

    if (isset($_REQUEST['action']) && $_REQUEST['action'] == 'duycode_reset_option') {
        foreach ($options_all as $name => $value) {
            if (str_contains($name, $prefix)) {
                delete_option($name);
            }
        }
        foreach ($options_example as $item) {
            add_option($item['id'], $item['default']);
        }
        header('Location: themes.php?page=' . basename(__FILE__) . '&duycode_reset_option=true');
        die;
    }



    add_theme_page("DuyCode Settings", "DuyCode Settings", 'edit_themes', basename(__FILE__), 'duycode_add_theme_page');
}

function duycode_add_theme_page() {
    global $prefix, $options_all;
    $options_current = [];

    foreach ($options_all as $name => $value) {
        if (str_contains($name, $prefix)) {
            array_push($options_current, ["id" => $name, "default" => $value]);
        }
    }
?>

    <link rel="stylesheet" type="text/css" href="<?php bloginfo('template_directory'); ?>/style.css" />
    <script>
        const removeField = (elem) => {
            if (confirm('Are you sure remove field ?')) {
                const hiddenForm = document.getElementById('hidden-form');
                hiddenForm.querySelector('[name="id"]').value = elem.previousElementSibling.name
                hiddenForm.action = "<?php echo './themes.php?page=' . basename(__FILE__) ?>";
                hiddenForm.submit();
            }
        }
    </script>

    <div class="admin-page-setting">
        <h2 class="title"> DuyCode Theme Options</h2>
        <p class="message-success">
            <?php
            if (isset($_REQUEST['duycode_create_option'])) {
                echo 'Create key successfull !!!';
            } elseif (isset($_REQUEST['duycode_update_option'])) {
                echo 'Update data successfull !!!';
            } elseif (isset($_REQUEST['duycode_delete_option'])) {
                echo 'Delete key successfull !!!';
            } elseif (isset($_REQUEST['duycode_reset_option'])) {
                echo 'Reset all data successfull !!!';
            } else {
                echo 'Have a beautiful day!';
            }
            ?>
        </p>

        <form action="post" id="hidden-form" style="display: none;">
            <input name="id" />
            <input name="action" value="duycode_delete_option" />
        </form>

        <form method="post" class="form" id="form-field-manager">
            <?php foreach ($options_current as $item) { ?>
                <div class="form-group">
                    <p class="label"><?php echo $item['id'] ?></p>
                    <input class="input" name="<?php echo $item['id'] ?>" value="<?php echo get_option($item['id']) ?>" />
                    <a class="btn btn-delete" onclick="removeField(this)"><i class="circle-xmark-regular"></i></a>
                </div>
            <?php } ?>
            <input type="hidden" name="action" value="duycode_update_option" />
            <div class="form-save">
                <button class="btn btn-primary" type="submit">Update <i class="floppy-disk-solid"></i></button>
            </div>
        </form>

        <h2 class="title advance-options"> Advance Options</h2>
        <details>
            <summary>Add New Key</summary>
            <form method="post" class="form form-add-key">
                <div class="form-group">
                    <p class="label">Key</p>
                    <div class="input-text">
                        <div class="input-before"><?php echo $prefix ?></div>
                        <input name="id" />
                    </div>
                </div>
                <div class="form-group">
                    <p class="label">Value</p>
                    <input class="input" name="default" />
                </div>
                <div class="form-save">
                    <input type="hidden" name="action" value="duycode_create_option" />
                    <button class="btn btn-primary" type="submit">Create Key <i class="circle-plus-solid"></i></button>
                </div>
            </form>
        </details>
        <br>
        <details class="reset-all-data">
            <summary>Reset All Data</summary>
            <form method="post" class="form form-reset">
                <input type="hidden" name="action" value="duycode_reset_option" />
                <button class="btn btn-danger" type="submit" onclick="return confirm('Are you sure ?')">Reset All Data <i class="circle-exclamation-solid"></i></button>
            </form>
        </details>
    </div>


<?php } ?>