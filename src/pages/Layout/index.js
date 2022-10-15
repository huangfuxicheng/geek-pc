import { Layout, Menu, Popconfirm } from 'antd'
import {
    LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useStore} from "@/store";
import {useEffect} from "react";
import { observer } from 'mobx-react-lite'
import menuList from './menu'

const { Header, Sider } = Layout

function getItem(
    label,
    key,
    icon,
    children,
    type,
) {
    return {
        key,
        icon,
        children,
        label,
        type,
    }
}

const GeekLayout = () => {
    const { userStore,loginStore } = useStore()
    const navigate = useNavigate()
    const onLogout = () => {
        loginStore.loginOut()
        navigate('/login')
    }
    // 获取用户数据
    useEffect(() => {
        try {
            userStore.getUserInfo()
        } catch { }
    }, [userStore])
    const hasAuth = (item) => {
        // if (!item.children) {
        //     return props.userInfo.user.role?.menus?.find((item2) => item2 === item.key)
        // } else if (item.children) {
        //     return item.children.some((item3) => props.userInfo.user?.role?.menus?.includes(item3.key))
        // }
        return true
    }

    const createMenu = (target) => {
        return target.map((item) => {
            if (hasAuth(item)) {
                if (!item.children) {
                    return getItem(<Link to={item.path}>{item.title}</Link>, item.key, item.icon)
                } else {
                    return getItem(item.title, item.key, item.icon, createMenu(item.children))
                }
            }return  false
        })
    }
    const items = createMenu(menuList)
    return (
        <Layout>
            <Header className="header">
                <div className="logo" />
                <div className="user-info">
                    <span className="user-name">{userStore?.userInfo?.name}</span>
                    <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={onLogout}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        items={items}
                        style={{ height: '100%', borderRight: 0 }}
                    />

                </Sider>
                <Layout className="layout-content" style={{ padding: 20 }}><Outlet /></Layout>

            </Layout>
        </Layout>
    )
}

export default observer(GeekLayout)