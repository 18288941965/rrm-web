<template>
  <div>
    <div class="org-body">
      <div class="org-tree">
        <div class="mgb-medium">
          <el-button
            type="success"
            :icon="Plus"
            @click="dialogParamsOpen({ dataId: '' })"
          >
            创建一级机构
          </el-button>
        </div>

        <org-tree
          ref="orgIndexTreeRef"
          :org-list="orgList"
          @set-active-org="setActiveTreeNode"
        />
      </div>
      
      <div class="org-detail">
        <div class="mgb-medium">
          <el-button
            :icon="Plus"
            :disabled="!activeTreeNode.id"
            @click="dialogParamsOpen({ dataId: '', parentId: activeTreeNode.id, parentName: activeTreeNode.name })"
          >
            添加子机构
          </el-button>

          <el-button
            :icon="Edit"
            :disabled="!activeTreeNode.id"
            @click="dialogParamsOpen({ dataId: activeTreeNode.id })"
          >
            编辑机构
          </el-button>

          <el-button
            :icon="Delete"
            :disabled="!activeTreeNode.id || activeTreeNode.childrenCount > 0"
            @click="deleteData"
          >
            删除机构
          </el-button>
        </div>

        <table>
          <tbody>
            <tr>
              <td>机构名称</td>
              <td>{{ activeTreeNode.name }}</td>
            </tr>
            <tr>
              <td>机构简称</td>
              <td>{{ activeTreeNode.abbrName }}</td>
            </tr>
            <tr>
              <td>机构代码</td>
              <td>{{ activeTreeNode.code }}</td>
            </tr>
            <tr>
              <td>机构类型</td>
              <td>{{ activeTreeNode.typeName }}</td>
            </tr>
            <tr>
              <td>机构状态</td>
              <td>{{ activeTreeNode.statusName }}</td>
            </tr>
            <tr>
              <td>更新时间</td>
              <td>{{ activeTreeNode.updatedAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <org-edit-dialog
      v-bind="dialogParam"
      @close-dialog="dialogParamsCloseAndRefresh"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {OrgBeanActive, OrgBeanVO} from './orgModel'
import {dialogParamsContent} from '@utils/dialogOptions'
import {deleteOrg, getOrgById, getOrgByItemCode} from './orgOption'
import {deleteConfirm} from '@utils/utils'
import OrgEditDialog from './org-edit-dialog.vue'
import {Delete, Edit, Plus, Search} from '@element-plus/icons-vue'
import OrgTree from './org-tree.vue'
import {deleteNodeById, updateOrInsertNode} from '@utils/treeUtils'

export default defineComponent({
  name: 'OrgIndex',
  components: {
    OrgEditDialog,
    OrgTree,
  },
  setup() {
    const orgIndexTreeRef = ref()
    const orgList = ref<Array<OrgBeanVO>>([])

    const query = () => {
      orgIndexTreeRef.value!.cleanTreeActiveId()
      getOrgByItemCode().then(res => {
        if (res.code === 200) {
          orgList.value = res.data
        }
      })
    }

    // ====== S ====== - 树节点点击事件
    const activeTreeNode = reactive<OrgBeanActive>({
      id: '',
      name: '',
      code: '',
      abbrName: '',
      typeName: '',
      updatedAt: null,
      statusName: '',
      childrenCount: 0,
    })
    const cleanActiveTreeNode = () => {
      Object.assign(activeTreeNode, {
        id: '',
        name: '',
        code: '',
        abbrName: '',
        typeName: '',
        updatedAt: null,
        statusName: '',
        childrenCount: 0,
      })
    }
    const setActiveTreeNode = (data: OrgBeanVO) => {
      Object.assign(activeTreeNode, data)
    }
    // ====== E ====== - 树节点点击事件

    const {
      dialogParam,
      dialogParamsOpen,
      dialogParamsClose,
    } = dialogParamsContent()
    const updateTreeNode = (editId: string) => {
      getOrgById(editId).then(res => {
        if (res.code === 200) {
          const data: OrgBeanVO = res.data
          updateOrInsertNode(orgList.value, editId, data, data.parentId)
          // 编辑菜单更新右侧内容
          if (editId === activeTreeNode.id) {
            setActiveTreeNode(data)
          }
        }
      })
    }
    const dialogParamsCloseAndRefresh = (refresh: boolean) => {
      dialogParamsClose()
      if (refresh) {
        updateTreeNode(activeTreeNode.id)
      }
    }

    const deleteData = () => {
      deleteConfirm('你确定要删除此机构吗？').then(flag => {
        if (flag) {
          deleteOrg(activeTreeNode.id).then(res => {
            if (res.code === 200) {
              deleteNodeById(orgList.value, activeTreeNode.id)

              cleanActiveTreeNode()
              orgIndexTreeRef.value!.cleanTreeActiveId()
            }
          })
        }
      })
    }

    onMounted(() => {
      query()
    })

    return {
      Search,
      Plus,
      Edit,
      Delete,

      setActiveTreeNode,
      orgIndexTreeRef,

      query,
      orgList,
      deleteData,
      activeTreeNode,

      dialogParam,
      dialogParamsOpen,
      dialogParamsCloseAndRefresh,
    }
  },
})
</script>

<style scoped lang="scss">
  .org-body{
    display: flex;
    & .org-tree{
      flex: 1;
    }
  }

  .org-detail{
    flex: 1;
    & table{
      width: 100%;
      border: 1px solid var(--border-color);
      border-collapse: collapse;
      line-height: 32px;
      & td{
        border-bottom: 1px solid var(--border-color);
      }
      & tr td:first-child{
        width: 120px;
        padding-left: var(--pd-small);
        border-right: 1px solid var(--border-color);
        font-weight: bolder;
        color: #909399;
        background-color: var(--bg-color-header);
      }
      & tr td:last-child{
        padding-left: var(--pd-medium);
      }
    }
  }
</style>