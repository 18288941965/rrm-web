import Mock from 'mockjs'

// 分页获取列表数据
Mock.mock('/api/admin/getDataList', 'post', (res) => {
    const bean = JSON.parse(res.body)
    const pageNum = bean.pageNum
    const pageSize = bean.pageSize

    const list = []
    for (let i = 0; i < 107; i++) {
        list.push({ name: `测试数据${i + 1}`, date: new Date().getTime() })
    }

    return {
        code: 200,
        msg: null,
        data: {
            list: list.slice((pageNum - 1) * pageSize, pageNum * pageSize),
            total: 107,
            pageNum,
            pageSize,
        },
    }
})

// 获取所有列表数据
Mock.mock('/api/admin/getAllDataList', 'post', (res) => {
    const list = []
    for (let i = 0; i < 527; i++) {
        list.push({ name: `测试数据${i + 1}`, date: new Date().getTime() })
    }
    return {
        code: 200,
        msg: null,
        data: list,
    }
})