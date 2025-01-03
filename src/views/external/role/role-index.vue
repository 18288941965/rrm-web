<template>
  <div>
    <div class="role-index-body">
      <div>
        <el-button
            class="mgb-medium"
            type="success"
            :icon="Plus"
            @click="dialogBaseOpen(undefined)"
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
              @click="dialogBaseOpen(undefined)"
          >
            添加子角色
          </el-button>

          <el-button
              :icon="Edit"
              :disabled="!activeTreeNode.id"
              @click="dialogBaseOpen(activeTreeNode.id)"
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
        </div>

        <div class="role-index-control">
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
            <el-button
                :icon="Apps"
                :disabled="!activeTreeNode.id"
                @click="dialogBindMenuOpen({ dataId: activeTreeNode.id, name: activeTreeNode.name })"
            >
              绑定菜单和控件
            </el-button>

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
        v-bind="dialogBase"
        @close-dialog="dialogBaseCloseAndRefresh($event, query)"
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
import {deleteRole, searchRoleTree, updateRoleStatus} from './roleOption'
import {dialogBaseContent, dialogParamsContent} from '@utils/dialogOptions'
import {Delete, Edit, Plus, Search} from '@element-plus/icons-vue'
import RoleEditDialog from './role-edit-dialog.vue'
import {ElMessage} from 'element-plus'
import {deleteConfirmContent} from '@utils/utils'
import {Apps} from '../../../components/svicon/menuIcon'
import MenuSelectDialog from '../menu/menu-select-dialog.vue'
import {countElement, countMenu} from '../menu/menuOption'
import RoleTree from './role-tree.vue'
import MenuElement from "../menu/menu-element.vue";

export default defineComponent({
  name: 'RoleIndex',
  components: {
    MenuElement,
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
      dialogBase,
      dialogBaseOpen,
      dialogBaseCloseAndRefresh,
    } = dialogBaseContent<string>()

    const setRoleStatus = (id: string, status: number) => {
      updateRoleStatus(id, status).then(res => {
        if (res.code !== 200) {
          for (let i = 0; i < roleList.value.length; i++) {
            if (id === roleList.value[i].id) {
              roleList.value[i].status = status === 1 ? 0 : 1
              break
            }
          }
        } else {
          ElMessage.success(res.message)
        }
      })
    }

    const deleteData = (id: string, name: string) => {
      deleteConfirmContent('建议停用角色而不是删除，删除后将不可恢复，是否确认执行删除操作？', name).then(flag => {
        if (flag) {
          deleteRole(id).then(res => {
            if (res.code === 200) {
              query()
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

      dialogBase,
      dialogBaseOpen,
      dialogBaseCloseAndRefresh,

      dialogBindMenu,
      dialogBindMenuOpen,
      dialogBindMenuCloseAndRefresh,
    }
  },
})
</script>

<style scoped lang="scss">
.role-index-body{
  display: grid;
  grid-template-columns: 1fr 1fr;
}

 .role-index-control{
  border: var(--border-1);
  border-radius: var(--border-radius-medium);
  & .control-top{
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: var(--size-medium);
    border-bottom: var(--border-1);
    padding-left: var(--pd-medium);
    padding-right: var(--pd-ultra-small);
  }
  & .control-main{
    padding: var(--pd-medium);
    & p{
      text-indent: 2rem;
      color: var(--color-black-secondary);
    }
    & .bind-source{
      padding-left: var(--pd-ultra-small);
      font-weight: bolder;
    }
  }
}


.role-toolbar {
  display: flex;
  align-items: center;
}

.role-count-bind {
  color: var(--el-color-success);
}

.role-count-unbind {
  color: var(--color-black-secondary);
}
</style>