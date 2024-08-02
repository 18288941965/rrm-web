<template>
  <div>
    <el-table
      :data="userList"
      border
    >
      <el-table-column
        prop="username"
        label="用户名"
      />
      <el-table-column
        prop="comment"
        label="备注"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted} from 'vue'
import {UserBean} from './userModel'
import {getAllUser} from './userOption'

export default defineComponent({
  name: 'UserIndex',
  setup() {
      const userList = ref<Array<UserBean>>([])
    
    const query = () => {
      getAllUser().then(data => {
        if (data.code === 200) {
          userList.value = data.data
        }
      })
    }
    
    onMounted(() => {
      query()
    })

    return {
      userList,
    }
  },
})
</script>



<style scoped lang="scss">

</style>