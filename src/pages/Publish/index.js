import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {Link, useSearchParams} from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {useEffect, useRef, useState} from "react";
import {http} from "@/utils";

const { Option } = Select

const Publish = () => {
    // 频道列表
    const [params] = useSearchParams()
    const articleId = params.get('id')
    const [form] = Form.useForm()
    const [imgCount, setImgCount] = useState(1)
    const fileListRef = useRef([])
    const [fileList, setFileList] = useState([])
    const [channels, setChannels] = useState([])
    useEffect(() => {
        async function fetchChannels() {
            const res = await http.get('/channels')
            setChannels(res.data.channels)
        }

        fetchChannels()
    }, [])

    useEffect(() => {
        async function getArticle () {
            const res = await http.get(`/mp/articles/${articleId}`)
            const { cover, ...formValue } = res.data
            // 动态设置表单数据
            form.setFieldsValue({ ...formValue, type: cover.type })
            // 格式化封面图片数据
            const imageList = cover.images.map(url => ({ url }))
            setFileList(imageList)
            setImgCount(cover.type)
            fileListRef.current = imageList
        }
        if (articleId) {
            // 拉取数据回显
            getArticle()
        }
        if(articleId === null){
            form.resetFields()
            // form.setFieldsValue({type: 1, content: '',channel_id: '',title: ''})
            setFileList([])
        }
    }, [articleId])
    // 上传成功回调
    const onUploadChange = info => {
        const fileList = info.fileList.map(file => {
            if (file.response) {
                return {
                    url: file.response.data.url
                }
            }
            return file
        })
        setFileList(fileList)
    }

    // 2. 上传图片时，将所有图片存储到 ref 中
    // const onUploadChange = info => {
    //     // ...
    //     fileListRef.current = imgUrls
    // }

    // 3. 切换图片类型
    const changeType = e => {
        // 使用原始数据作为判断条件
        const count = e.target.value
        setImgCount(count)

        if (count === 1) {
            // 单图，只展示第一张
            const firstImg = fileListRef.current[0]
            setFileList(!firstImg ? [] : [firstImg])
        } else if (count === 3) {
            // 三图，展示所有图片
            setFileList(fileListRef.current)
        }
    }
    const onFinish = async (values) => {
        const { type, ...rest } = values
        const data = {
            ...rest,
            // 注意：接口会按照上传图片数量来决定单图 或 三图
            cover: {
                type,
                images: fileList.map(item => item.url)
            }
        }
        if(articleId){
            // 编辑
            await http.put(`/mp/articles/${data.id}?draft=false`,data)
        }else{
            // 新增
            await http.post('/mp/articles?draft=false', data)
        }
    }

    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {articleId ? '修改文章' : '发布文章'}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                }
            >
                <Form
                    form={form}
                    labelCol={{span: 4}}
                    wrapperCol={{span: 16}}
                    initialValues={{type: 1, content: ''}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{required: true, message: '请输入文章标题'}]}
                    >
                        <Input placeholder="请输入文章标题" style={{width: 400}}/>
                    </Form.Item>
                    <Form.Item
                        label="频道"
                        name="channel_id"
                        rules={[{required: true, message: '请选择文章频道'}]}
                    >
                        <Select placeholder="请选择文章频道" style={{width: 400}}>
                            {channels.map(item => (
                                <Option key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="封面">
                        <Form.Item name="type">
                            <Radio.Group onChange={changeType}>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {imgCount > 0 && (
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList
                                action="http://geek.itheima.net/v1_0/upload"
                                fileList={fileList}
                                onChange={onUploadChange}
                                maxCount={imgCount}
                                multiple={imgCount > 1}
                            >
                                <div style={{marginTop: 8}}>
                                    <PlusOutlined/>
                                </div>
                            </Upload>
                        )}
                    </Form.Item>
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{required: true, message: '请输入文章内容'}]}
                    >
                        <ReactQuill
                            className="publish-quill"
                            theme="snow"
                            placeholder="请输入文章内容"
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 4}}>
                        <Space>
                            <Button size="large" type="primary" htmlType="submit">
                                {articleId ? '修改文章' : '发布文章'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Publish