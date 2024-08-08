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
          >
            登录项目
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="itemCode"
        label="项目代码"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
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
                v-if="scope.row.userId === item.id"
                size="small"
                type="primary"
              >
                创建者
              </el-tag>
              <el-tag
                v-else
                size="small"
                type="info"
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
            @click="dialogBaseOpen(scope.row.id)"
          />

          <el-button
            type="danger"
            :icon="Delete"
            :disabled="scope.row.itemCode === activeItemCode
              ||
              scope.row.userId !== scope.row.loginId"
            @click="deleteData(scope.row.id)"
          />
          <el-button
            :icon="EditPen"
            :disabled="scope.row.userId !== scope.row.loginId"
            @click="dialogTeamOpen({ dataId: scope.row.id, userId: scope.row.userId })"
          >
            协作者
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <app-item-edit-dialog
      :data-id="dialogBase.dataId as number"
      :show="dialogBase.show"
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
import {deleteConfirm} from '@utils/utils'
import ItemTeamworkerDialog from './item-teamworker-dialog.vue'

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
    } = dialogBaseContent()

    const {
      dialogParam: dialogTeam,
      dialogParamsCloseAndRefresh: dialogTeamCloseAndRefresh,
      dialogParamsOpen: dialogTeamOpen,
    } = dialogParamsContent()

    const deleteData = (id: number) => {
      // TODO 验证项目绑定的角色
      // TODO 验证项目绑定的资源等
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
  display: grid;
  grid-template-columns: 100px 1fr;
  grid-column-gap: 20px;
  align-items: center;
  line-height: var(--size-default);
  &:hover{
    background-color: var(--bg-color-hover);
  }
}
</style>