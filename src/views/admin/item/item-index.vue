<template>
  <div>
    <el-table
      :data="itemList"
      border
    >
      <el-table-column
        prop="itemName"
        label="项目名称"
        width="180"
      />
      <el-table-column
        prop="itemCode"
        label="项目代码"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        prop="username"
        label="创建人"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import {ItemBeanVO} from './itemModel'
import {getAllItem} from './itemOption'
import LocalStorage from '../../../class/LocalStorage'

export default defineComponent({
  name: 'ItemIndex',
  setup() {
    const itemList = ref<Array<ItemBeanVO>>([])
    const username = ref('')

    const query = () => {
      getAllItem().then(res => {
        if (res.code == 200) {
          itemList.value = res.data
        }
      })
    }
    
    onMounted(() => {
      username.value = new LocalStorage().getUserInfoObj().userName
      query()
    })
    
    return {
      itemList,
    }
  },
})
</script>


<style scoped lang="scss">

</style>