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

    <el-button
      class="mgb-medium"
      :icon="Refresh"
      @click="query"
    >
      刷新页面
    </el-button>

    <el-table
      :data="itemList"
      border
      table-layout="auto"
    >
      <el-table-column
        prop="itemName"
        label="项目名称"
      >
        <template #default="scope">
          <span>{{ scope.row.itemName }}</span>
          <el-tag
            v-if="scope.row.itemCode === activeItemCode"
            type="success"
            class="mgl-medium"
            round
          >
            登录项目
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemCode"
        label="项目代码"
        width="100"
      />
      <el-table-column
        prop="createdAt"
        label="创建时间"
        width="180"
      />
      <el-table-column
        prop="userList"
        label="关联用户"
      >
        <template #default="scope">
          <ul class="item-index-item">
            <li
              v-for="(item, index) in scope.row.userList"
              :key="scope.$index + '_' + index"
            >
              <el-tag
                v-if="scope.row.createdBy === item.id"
                size="small"
                type="primary"
                class="mgr-medium"
                round
              >
                创建者
              </el-tag>
              <el-tag
                v-else
                size="small"
                type="info"
                class="mgr-medium"
                round
              >
                协作者
              </el-tag>
              <span>{{ item.username }}</span>
            </li>
          </ul>
        </template>
      </el-table-column>>
      <el-table-column>
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            :disabled="scope.row.createdBy !== scope.row.loginId"
            @click="dialogBaseOpen(scope.row.id)"
          />

          <el-button
            type="danger"
            :icon="Delete"
            :disabled="scope.row.itemCode === activeItemCode
              ||
              scope.row.createdBy !== scope.row.loginId"
            @click="deleteData(scope.row.id)"
          />
          <el-button
            :icon="EditPen"
            :disabled="scope.row.createdBy !== scope.row.loginId"
            @click="dialogTeamOpen({ dataId: scope.row.id, createdBy: scope.row.createdBy })"
          >
            协作者
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <app-item-edit-dialog
      v-bind="dialogBase"
      @close-dialog="dialogBaseCloseAndRefresh($event, query)"
    />
    
    <item-teamworker-dialog
      v-bind="dialogTeam"
      @close-dialog="dialogTeamCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import {ItemBeanVO} from './itemModel'
import {deleteItem, getAllItem} from './itemOption'
import LocalStorage from '../../../class/LocalStorage'
import AppItemEditDialog from './app-item-edit-dialog.vue'
import {dialogBaseContent, dialogParamsContent} from '@utils/dialogOptions'
import {Plus, Delete, Edit, EditPen,Refresh} from '@element-plus/icons-vue'
import ItemTeamworkerDialog from './item-teamworker-dialog.vue'
import {ElMessageBox} from 'element-plus'
import {h} from 'vue'
import {ElMessage} from 'element-plus/es'

export default defineComponent({
  name: 'ItemIndex',
  components: {
    AppItemEditDialog,
    ItemTeamworkerDialog,
  },
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
    } = dialogBaseContent<number>()

    const {
      dialogParam: dialogTeam,
      dialogParamsCloseAndRefresh: dialogTeamCloseAndRefresh,
      dialogParamsOpen: dialogTeamOpen,
    } = dialogParamsContent()

    const deleteData = (id: number) => {
      const findObj = itemList.value.find(item => item.id === id)
      if (!findObj) {
        return
      }
      // TODO 清空所有表
      ElMessageBox.prompt(
          h('div', { style: '' }, [
            h('p', { style: 'font-weight: bold;' },`【${findObj.itemName} / ${findObj.itemCode}】`),
            h('p', { style: 'color: red; font-weight: bold;' },'• 删除项目将会清空一切项目下相关的数据'),
            h('p', { style: '' }, '请在输入框中输入项目名称和代码，用“,”号分割'),
            h('span', { style: 'color: red; font-weight: bold;' }, '• 删除后不可恢复！！！！！！！！！！！！'),
          ]),
          '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
            type: 'warning',
      })
          .then(({ value }) => {
            if (value !== findObj.itemName+','+findObj.itemCode) {
              ElMessage.warning('删除失败！输入有误！')
              return
            }
            deleteItem(id).then(res => {
              if (res.code == 200) {
                query()
              }
            })
          })
          .catch(() => {})
    }
    
    onMounted(() => {
      activeItemCode.value = new LocalStorage().getUserInfoObj().itemCode
      query()
    })
    
    return {
      Plus,
        Delete,
        Edit,
      EditPen,
      Refresh,
      activeItemCode,
      query,
      itemList,
      deleteData,
      dialogBase,
      dialogBaseCloseAndRefresh,
      dialogBaseOpen,

      dialogTeam,
      dialogTeamCloseAndRefresh,
      dialogTeamOpen,
    }
  },
})
</script>


<style scoped lang="scss">
.item-index-item li{
  display: flex;
  align-items: center;
  line-height: var(--size-medium);
}
</style>