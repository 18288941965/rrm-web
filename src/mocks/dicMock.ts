// 获取字典
import Mock from 'mockjs'

Mock.mock('/api/admin/getDict', {
    code: 200,
    message: null,
    data: [
        { label: 'label选项1',   value: '01' },
        { label: 'label选项2', value: '02' },
        { label: 'label选项3',  value: '03' },
    ],
})

// 获取字典
Mock.mock('/api/admin/getDict2', {
    code: 200,
    message: null,
    data: [
        { mc: 'mc选项1',   dm: '01' },
        { mc: 'mc选项2', dm: '02' },
        { mc: 'mc选项3',  dm: '03' },
    ],
})