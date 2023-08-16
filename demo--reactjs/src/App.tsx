import React, { useState } from "react";
import { Button, Descriptions, Result, Avatar, Space, Statistic } from "antd";
import { LikeOutlined, UserOutlined } from "@ant-design/icons";

import type { ProSettings } from "@ant-design/pro-layout";
import ProLayout, {
    PageContainer,
    SettingDrawer,
} from "@ant-design/pro-layout";
import defaultProps from "./_defaultProps";

const content = (
    <Descriptions size="small" column={2}>
        <Descriptions.Item label="Author">Ant Design</Descriptions.Item>
        <Descriptions.Item label="Info">
            <a>421421</a>
        </Descriptions.Item>
        <Descriptions.Item label="Create">2017-01-10</Descriptions.Item>
        <Descriptions.Item label="Update">2017-10-10</Descriptions.Item>
        <Descriptions.Item label="Adress">
            Haf nooij
        </Descriptions.Item>
    </Descriptions>
);

export default () => {
    const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
        fixSiderbar: true,
    });
    const [pathname, setPathname] = useState("/welcome");
    return (
        <div
            id="test-pro-layout"
            style={{
                height: "100vh",
            }}
        >
            <ProLayout
                {...defaultProps}
                location={{
                    pathname,
                }}
                waterMarkProps={{
                    content: "Pro Layout",
                }}
                menuFooterRender={(props) => {
                    return (
                        <a
                            style={{
                                lineHeight: "48rpx",
                                display: "flex",
                                height: 48,
                                color: "rgba(255, 255, 255, 0.65)",
                                alignItems: "center",
                            }}
                            href="https://preview.pro.ant.design/dashboard/analysis"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                alt="pro-logo"
                                src="https://procomponents.ant.design/favicon.ico"
                                style={{
                                    width: 16,
                                    height: 16,
                                    margin: "0 16px",
                                    marginRight: 10,
                                }}
                            />
                            {!props?.collapsed && "Preview Pro"}
                        </a>
                    );
                }}
                onMenuHeaderClick={(e) => console.log(e)}
                menuItemRender={(item, dom) => (
                    <a
                        onClick={() => {
                            setPathname(item.path || "/welcome");
                        }}
                    >
                        {dom}
                    </a>
                )}
                rightContentRender={() => (
                    <div>
                        <Avatar
                            shape="square"
                            size="small"
                            icon={<UserOutlined />}
                        />
                    </div>
                )}
                {...settings}
            >
                <PageContainer
                    content={content}
                    tabList={[
                        {
                            tab: "Tabe1",
                            key: "base",
                        },
                        {
                            tab: "Tabe2",
                            key: "info",
                        },
                    ]}
                    extraContent={
                        <Space size={24}>
                            <Statistic
                                title="Feedback"
                                value={1128}
                                prefix={<LikeOutlined />}
                            />
                            <Statistic
                                title="Unmerged"
                                value={93}
                                suffix="/ 100"
                            />
                        </Space>
                    }
                    extra={[
                        <Button key="3">Button 1</Button>,
                        <Button key="2">Button 2</Button>,
                        <Button key="1" type="primary">
                            Button 3
                        </Button>,
                    ]}
                    footer={[
                        <Button key="3">Footer</Button>,
                        <Button key="2" type="primary">
                            Footer
                        </Button>,
                    ]}
                >
                    <div
                        style={{
                            height: "120vh",
                        }}
                    >
                        <Result
                            status="404"
                            style={{
                                height: "100%",
                                background: "#fff",
                            }}
                            title="Hello World"
                            subTitle="Sorry, you are not authorized to access this page."
                            extra={<Button type="primary">Back Home</Button>}
                        />
                    </div>
                </PageContainer>
            </ProLayout>
            <SettingDrawer
                pathname={pathname}
                getContainer={() => document.getElementById("test-pro-layout")}
                settings={settings}
                onSettingChange={(changeSetting) => {
                    setSetting(changeSetting);
                }}
                disableUrlParams
            />
        </div>
    );
};
