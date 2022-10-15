import {DiffOutlined, EditOutlined, HomeOutlined,} from "@ant-design/icons";

const menu = [{
    title: '首页',//菜单标题名称
    key: 'home',
    icon: <HomeOutlined/>,
    path: '/'
}, {
    title: '内容管理',
    key: 'article',
    icon: <DiffOutlined/>,
    path: 'article',
}, {
    title: '发布文章',
    key: 'publish',
    icon: <EditOutlined />,
    path: 'publish'
},
]

export default menu