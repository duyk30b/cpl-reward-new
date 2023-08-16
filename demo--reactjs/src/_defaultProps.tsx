import React from "react";
import {
    SmileOutlined,
    CrownOutlined,
    TabletOutlined,
    AntDesignOutlined,
} from "@ant-design/icons";

export default {
    route: {
        path: "/",
        routes: [
            {
                path: "/welcome",
                name: "Welcome",
                icon: <SmileOutlined />,
                component: "./Welcome",
            },
            {
                path: "/tu-thuoc",
                name: "Tủ Thuốc",
                icon: <SmileOutlined />,
                component: "./TuThuoc",
            },
            {
                path: "/phieu-nhap",
                name: "Phiếu Nhập Thuốc",
                icon: <CrownOutlined />,
                access: "canAdmin",
                component: "./PhieuNhap",
                routes: [
                    {
                        path: "/phieu-nhap/danh-sach",
                        name: "一 Danh sách",
                        icon: <CrownOutlined />,
                        component: "./Welcome",
                    },
                    {
                        path: "/phieu-nhap/tao-phieu",
                        name: "一 Tạo Phiếu Mới",
                        icon: <CrownOutlined />,
                        component: "./Welcome",
                    },
                ],
            },
            {
                path: "/don-thuoc",
                name: "Đơn Thuốc",
                icon: <CrownOutlined />,
                access: "canAdmin",
                component: "./DonThuoc",
                routes: [
                    {
                        path: "/don-thuoc/danh-sach",
                        name: "一 Danh sách",
                        icon: <CrownOutlined />,
                        component: "./Welcome",
                    },
                    {
                        path: "/don-thuoc/tao-don",
                        name: "一 Tạo Đơn Mới",
                        icon: <CrownOutlined />,
                        component: "./Welcome",
                    },
                ],
            },
            {
                name: "List",
                icon: <TabletOutlined />,
                path: "/list",
                component: "./ListTableList",
                routes: [
                    {
                        path: "/list/sub-page",
                        name: "一一Subpage",
                        icon: <CrownOutlined />,
                        routes: [
                            {
                                path: "sub-sub-page1",
                                name: "一一Subpage1",
                                icon: <CrownOutlined />,
                                component: "./Welcome",
                            },
                            {
                                path: "sub-sub-page2",
                                name: "一一Subpage12",
                                icon: <CrownOutlined />,
                                component: "./Welcome",
                            },
                            {
                                path: "sub-sub-page3",
                                name: "一一Subpage13",
                                icon: <CrownOutlined />,
                                component: "./Welcome",
                            },
                        ],
                    },
                    {
                        path: "/list/sub-page2",
                        name: "一一Subpage22",
                        icon: <CrownOutlined />,
                        component: "./Welcome",
                    },
                    {
                        path: "/list/sub-page3",
                        name: "一一Subpage23",
                        icon: <CrownOutlined />,
                        component: "./Welcome",
                    },
                ],
            },
            {
                path: "https://ant.design",
                name: "Ant Design WWebsite",
                icon: <AntDesignOutlined />,
            },
        ],
    },
    location: {
        pathname: "/",
    },
};
