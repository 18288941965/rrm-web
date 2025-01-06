<template>
  <div>
    <div class="layout-main">
      <div>
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
          @set-active-node="setActiveTreeNode"
        />
      </div>
      
      <div>
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

        <div class="layout-right-control">
          <div class="control-top">
            <h4>
            <span
                v-if="!activeTreeNode.id"
                class="no-data"
            >请点击左侧机构进行后续操作</span>
              {{ activeTreeNode.name }}
            </h4>
          </div>
          <div class="control-main">
            <p>机构名称：{{ activeTreeNode.name }}</p>
            <p>机构简称：{{ activeTreeNode.abbrName }}</p>
            <p>机构代码：{{ activeTreeNode.code }}</p>
            <p>机构类型：{{ activeTreeNode.typeName }}</p>
            <p>机构状态：{{ activeTreeNode.statusName }}</p>
            <p>更新时间：{{ activeTreeNode.updatedAt }}</p>
          </div>
        </div>
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
@use "../../../assets/scssscoped/layout/tree-layout";
</style>