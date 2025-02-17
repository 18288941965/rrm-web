<template>
  <div>
    <div class="layout-main">
      <div>
        <el-button
          class="mgb-medium"
          type="success"
          :icon="Plus"
          @click="dialogParamsOpen({ dataId: '' })"
        >
          创建一级角色
        </el-button>
        <role-tree
          ref="roleIndexTreeRef"
          :role-list="roleList"
          @set-active-node="setActiveTreeNode"
        />
      </div>

      <div>
        <div class="mgb-medium">
          <el-button
            :icon="Plus"
            :disabled="!activeTreeNode.id"
            @click="dialogParamsOpen({
              dataId: '',
              parentId: activeTreeNode.id,
              parentName: activeTreeNode.name,
              terminal: activeTreeNode.terminal,
              netType: activeTreeNode.netType
            })"
          >
            添加子角色
          </el-button>

          <el-button
            :icon="Edit"
            :disabled="!activeTreeNode.id"
            @click="dialogParamsOpen({ dataId: activeTreeNode.id })"
          >
            编辑角色
          </el-button>

          <el-button
            :icon="Delete"
            :disabled="!activeTreeNode.id || activeTreeNode.childrenCount >= 1"
            @click="deleteData(activeTreeNode.id, activeTreeNode.name)"
          >
            删除角色
          </el-button>

          <el-button
            :icon="Apps"
            :disabled="!activeTreeNode.id"
            @click="dialogBindMenuOpen({ dataId: activeTreeNode.id, name: activeTreeNode.name })"
          >
            绑定菜单和控件
          </el-button>
        </div>

        <div class="layout-right-control">
          <div class="control-top">
            <h4>
              <span
                v-if="!activeTreeNode.id"
                class="no-data"
              >请点击左侧角色名称进行后续操作</span>
              {{ activeTreeNode.name }}
            </h4>

            <div>
              <el-switch
                v-model="activeTreeNode.status"
                :disabled="!activeTreeNode.id"
                inline-prompt
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="停用"
                @change="setRoleStatus(activeTreeNode.id, activeTreeNode.status)"
              />
            </div>
          </div>

          <div class="control-main">
            <p>
              角色描述：{{ activeTreeNode.description }}
            </p>
            <p>
              绑定菜单：{{ activeTreeNode.bindMenuCount }} / {{ countObj.menuCount }}
            </p>
            <p>
              绑定控件：{{ activeTreeNode.bindElementCount }} / {{ countObj.elementCount }}
            </p>

            <template v-if="activeTreeNode.id">
              <el-tag
                type="info"
                class="mgl-medium"
              >
                {{ activeTreeNode.typeName }}
              </el-tag>

              <el-tag
                type="info"
                class="mgl-medium"
              >
                {{ activeTreeNode.terminalName }}
              </el-tag>

              <el-tag
                type="info"
                class="mgl-medium"
              >
                {{ activeTreeNode.netTypeName }}
              </el-tag>
            </template>
          </div>
        </div>
      </div>
    </div>

    <role-edit-dialog
      v-bind="dialogParam"
      @close-dialog="dialogParamsCloseAndRefresh"
    />

    <menu-select-dialog
      v-bind="dialogBindMenu"
      @close-dialog="dialogBindMenuCloseAndRefresh"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {RoleBeanActive, RoleBeanVO} from './roleModel'
import {deleteRole, getRoleById, searchRoleTree, updateRoleStatus} from './roleOption'
import {dialogParamsContent} from '@utils/dialogOptions'
import {Delete, Edit, Plus, Search} from '@element-plus/icons-vue'
import RoleEditDialog from './role-edit-dialog.vue'
import {ElMessage} from 'element-plus'
import {deleteConfirmContent} from '@utils/utils'
import {Apps} from '../../../components/svicon/menuIcon'
import MenuSelectDialog from '../menu/menu-select-dialog.vue'
import {countElement, countMenu} from '../menu/menuOption'
import RoleTree from './role-tree.vue'
import {deleteNodeById, updateOrInsertNode} from '@utils/treeUtils'

export default defineComponent({
  name: 'RoleIndex',
  components: {
    RoleTree,
    RoleEditDialog,
    MenuSelectDialog,
  },
  setup() {
    const roleIndexTreeRef = ref()
    const roleList = ref<Array<RoleBeanVO>>([])

    const query = () => {
      roleIndexTreeRef.value!.cleanTreeActiveId()
      searchRoleTree().then(res => {
        if (res.code === 200) {
          roleList.value = res.data
        }
      })
    }

    // ====== S ====== - 树节点点击事件
    const activeTreeNode = reactive<RoleBeanActive>({
      id: '',
      name: '',
      status: 0,
      description: '',
      terminal: '',
      netType: '',
      typeName: '',
      terminalName: '',
      netTypeName: '',
      bindMenuCount: 0,
      bindElementCount: 0,
      children: [],
      childrenCount: 0,
    })
    const cleanActiveTreeNode = () => {
      Object.assign(activeTreeNode, {
        id: '',
        name: '',
        status: 0,
        description: '',
        terminal: '',
        netType: '',
        typeName: '',
        terminalName: '',
        netTypeName: '',
        bindMenuCount: 0,
        bindElementCount: 0,
        children: [],
        childrenCount: 0,
      })
    }
    const setActiveTreeNode = (data: RoleBeanVO) => {
      Object.assign(activeTreeNode, data)
    }
    // ====== E ====== - 树节点点击事件

    const countObj = reactive<{
      menuCount: number
      elementCount: number
    }>({
      menuCount: 0,
      elementCount: 0,
    })

    const {
      dialogParam,
      dialogParamsOpen,
      dialogParamsClose,
    } = dialogParamsContent()

    const updateTreeNode = (editId: string) => {
      getRoleById(editId).then(res => {
        if (res.code === 200) {
          const data: RoleBeanVO = res.data
          updateOrInsertNode(roleList.value, editId, data, data.parentId)
          // 编辑菜单更新右侧内容
          if (editId === activeTreeNode.id) {
            setActiveTreeNode(data)
          }
        }
      })
    }
    const dialogParamsCloseAndRefresh = (refresh: boolean, id: string) => {
      dialogParamsClose()
      if (refresh) {
        updateTreeNode(id)
      }
    }

    const setRoleStatus = (id: string, status: number) => {
      updateRoleStatus(id, status).then(res => {
        if (res.code === 200) {
          updateTreeNode(id)
          ElMessage.success(res.message)
        }
      })
    }

    const deleteData = (id: string, name: string) => {
      deleteConfirmContent('建议停用角色而不是删除，删除将会清空相关信息且不可恢复，你确定要执行删除操作吗？', name).then(flag => {
        if (flag) {
          deleteRole(id).then(res => {
            if (res.code == 200) {
              deleteNodeById(roleList.value, activeTreeNode.id)

              cleanActiveTreeNode()
              roleIndexTreeRef.value!.cleanTreeActiveId()
            }
          })
        }
      })
    }

    const {
      dialogParam: dialogBindMenu,
      dialogParamsOpen: dialogBindMenuOpen,
      dialogParamsClose: dialogBindMenuClose,
    } = dialogParamsContent()

    const dialogBindMenuCloseAndRefresh = (menuSize: number, elementSize: number, roleId: string) => {
      dialogBindMenuClose()
      roleList.value.forEach(item => {
        if (item.id === roleId) {
          item.bindMenuCount = menuSize
          item.bindElementCount = elementSize
          return
        }
      })
    }

    onMounted(() => {
      query()

      countMenu().then(res => {
        if (res.code === 200) {
          countObj.menuCount = res.data
        }
      })

      countElement().then(res => {
        if (res.code === 200) {
          countObj.elementCount = res.data
        }
      })
    })

    return {
      Search,
      Plus,
      Edit,
      Delete,
      Apps,
      roleList,
      query,
      countObj,

      roleIndexTreeRef,
      activeTreeNode,
      cleanActiveTreeNode,
      setActiveTreeNode,


      deleteData,
      setRoleStatus,

      dialogParam,
      dialogParamsOpen,
      dialogParamsCloseAndRefresh,

      dialogBindMenu,
      dialogBindMenuOpen,
      dialogBindMenuCloseAndRefresh,
    }
  },
})
</script>

<style scoped lang="scss">
@use "../../../assets/scssscoped/tree-layout";
</style>