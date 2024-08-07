<template>
  <div>
    <el-button
      class="mgb-medium"
      type="success"
      :icon="Plus"
      @click="dialogBaseOpen(undefined)"
    >
      创建项目
    </el-button>
    
    <el-table
      :data="itemList"
      border
    >
      <el-table-column
        prop="itemName"
        label="项目名称"
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
      <el-table-column>
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="dialogBaseOpen(scope.row.itemId)"
          />

          <el-button
            type="danger"
            :icon="Delete"
            :disabled="scope.row.itemCode === activeItemCode"
            @click="deleteData(scope.row.itemId)"
          />
        </template>
      </el-table-column>
    </el-table>

    <app-item-edit
      :data-id="dialogBase.dataId as number"
      :show="dialogBase.show"
      @close-dialog="dialogBaseCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {ItemBeanVO} from './itemModel'
import {deleteItem, getAllItem} from './itemOption'
import LocalStorage from '../../../class/LocalStorage'
import appItemEdit from './app-item-edit.vue'
import {dialogBaseContent} from '@utils/dialogOptions'
import {Plus, Delete, Edit} from '@element-plus/icons-vue'
import {ElMessageBox} from 'element-plus'
import {deleteConfirm} from '@utils/utils'

export default defineComponent({
  name: 'ItemIndex',
  components: {appItemEdit},
  setup() {
    const itemList = ref<Array<ItemBeanVO>>([])
    const activeItemCode = ref('')

    const query = () => {
      getAllItem().then(res => {
        if (res.code == 200) {
          itemList.value = res.data
        }
      })
    }

    const {
      dialogBase,
      dialogBaseCloseAndRefresh,
      dialogBaseOpen,
    } = dialogBaseContent()

    const deleteData = (id: number) => {
      deleteConfirm('你确定要删除此项目吗').then(data => {
        if (data) {
          deleteItem(id).then(res => {
            if (res.code == 200) {
              query()
            }
          })
        }
      })
    }
    
    onMounted(() => {
      activeItemCode.value = new LocalStorage().getUserInfoObj().itemCode
      query()
    })
    
    return {
      Plus,
        Delete,
        Edit,
      activeItemCode,
      query,
      itemList,
      deleteData,
      dialogBase,
      dialogBaseCloseAndRefresh,
      dialogBaseOpen,
    }
  },
})
</script>


<style scoped lang="scss">

</style>