<template>
  <el-dialog
    v-model="visible"
    width="720"
    :before-close="handleClose"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <template #header>
      <dialog-header
        title="绑定菜单和控件"
        :name="params.name"
      />
    </template>
    <div class="menu-select-main">
      <el-tree
        ref="menuSelectElTreeRef"
        class="menu-index-tree"
        :class="{'tree-bd': menuList && menuList.length < 1}"
        :data="menuList"
        :props="{label: 'name', children: 'children'}"
        :default-checked-keys="bindObj.menuIds"
        node-key="id"
        show-checkbox
        default-expand-all
        :expand-on-click-node="false"
        :check-strictly="true"
        @check-change="treeCheckChange"
        @node-click="treeNodeClick"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span class="tree-node-label">
              {{ node.label }}
            </span>
            <span>
              <el-tag
                v-if="!data.visibility"
                type="warning"
                round
                size="small"
                class="mgl-medium"
              >
                不可见
              </el-tag>
            </span>
          </span>
        </template>
      </el-tree>

      <div class="menu-element">
        <h5>{{ bindObj.clickMenuName }} <span>控件</span></h5>
        <ul v-if="elementList.length > 0">
          <li
            v-for="(element, index) in elementList"
            :key="'sel-e-' + index"
          >
            <el-checkbox
              v-model="element.checked"
              :disabled="!bindObj.menuIds.includes(bindObj.clickMenuId)"
              :label="element.name"
              @change="elementChange($event, element.id)"
            />
          </li>
        </ul>
        <span
          v-else
          class="no-data"
        >暂无数据</span>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType, reactive, ref, watch} from 'vue'
import {PropPrams} from '@utils/interface'
import {dialogOptions} from '@utils/dialogOptions'

import DialogHeader from '../../../components/dialog-header.vue'
import {MenuBean, MenuBeanVO, MenuElementBean} from './menuModel'
import {getMenuByItemCode, getMenuElementByMenuId} from './menuOption'
import type Node from 'element-plus/es/components/tree/src/model/node'
import {bindRoleMenu, getRoleBindMenuByRoleId, unbindRoleMenu} from '../role/roleOption'
import {ElMessage} from 'element-plus/es'
import {RoleMenuBean} from '../role/roleModel'
import {BindType} from '@utils/enum'

export default defineComponent({
  name: 'MenuSelectDialog',
  components: {
    DialogHeader,
  },
  props: {
    params: {
      type: Object as PropType<PropPrams>,
      default() {
        return {
          dataId: '',
          name: '',
        }
      },
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup(props, {emit}) {
    const {
      visible,
    } = dialogOptions()

    const menuSelectElTreeRef = ref()
    const menuList = ref<Array<MenuBean>>([])
    const elementList = ref<Array<MenuElementBean>>([])

    const bindObj = reactive<{
      menuIds: Array<string>
      elementIds: Array<string>
      clickMenuId: string
      clickMenuName: string
    }>({
      menuIds: [],
      elementIds: [],
      clickMenuId: '',
      clickMenuName: '',
    })

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const treeNodeClick = (data: MenuBeanVO) => {
      getMenuElementByMenuId(data.id).then(res => {
        if (res.code === 200) {
          elementList.value = res.data
          elementList.value.forEach(item => {
            if (bindObj.elementIds.includes(item.id)) {
              item.checked = true
            }
          })
          bindObj.clickMenuId = data.id
          bindObj.clickMenuName = data.name
        }
      })
    }

    // -------------------选择---------------------start
    const getNodePathParent = (node: Node) => {
      const path = []
      let currentNode = node
      while (currentNode) {
        path.unshift(currentNode.data.id) // 假设节点的标签是 'label'
        currentNode = currentNode.parent // 确保节点有父节点
      }
      return path.filter(item => item)
    }

    const selectMenu = (data: MenuBeanVO) => {
      const node: Node = menuSelectElTreeRef.value.getNode(data.id)
      const nodePath = getNodePathParent(node)
      // 严格选择，即选择子菜单必须选择父菜单
      const temp: Array<string> = []
      for (let i = 0; i < nodePath.length; i++) {
        if (!bindObj.menuIds.includes(nodePath[i])) {
          temp.push(nodePath[i])
        }
      }
      // 阻止二次触发，在手动设置选中的时候会再次触发事件
      if (temp.length <= 0){
        return
      }
      bindRoleMenu({
        roleId: props.params.dataId,
        menuId: temp.join(','),
        type: BindType.MENU,
      }).then(res => {
        if (res.code === 200) {
          nodePath.forEach(menuId => {
            if (!bindObj.menuIds.includes(menuId)) {
              bindObj.menuIds.push(menuId)
              menuSelectElTreeRef.value.setChecked(menuId, true, false)
            }
          })
          ElMessage.success('操作成功')
        }
      }).catch(() => {
        menuSelectElTreeRef.value.setCheckedKeys(bindObj.menuIds)
      })
    }
    const selectElement = (elementId: string) => {
      bindRoleMenu({
        roleId: props.params.dataId,
        menuId: elementId,
        type: BindType.ELEMENT,
      }).then(res => {
        if (res.code === 200) {
          bindObj.elementIds.push(elementId)
          ElMessage.success('操作成功')
        }
      }).catch(() => {
        elementList.value.forEach(element => {
          if (element.id === elementId) {
            element.checked = false
            return
          }
        })
      })
    }
    // -------------------选择---------------------end

    // -------------------取消选择---------------------start
    const getNodePathChild = (data: MenuBeanVO, childrenId: Array<string>) => {
      if (bindObj.menuIds.includes(data.id)) {
        childrenId.push(data.id)
      }
      if (data.children && data.children.length > 0) {
        data.children.forEach(item => {
          getNodePathChild(item, childrenId)
        })
      }
    }
    const unselectMenu = (data: MenuBeanVO) => {
      const childrenId: Array<string> = []
      getNodePathChild(data, childrenId)
      // 阻止二次触发，在手动设置选中的时候会再次触发事件
      if (childrenId.length <= 0) {
        return
      }
      unbindRoleMenu(props.params.dataId, childrenId.join(','), BindType.MENU).then(res => {
        if (res.code === 200) {
          childrenId.forEach(id => {
            const indexOf = bindObj.menuIds.indexOf(id)
            if (indexOf !== -1) {
              bindObj.menuIds.splice(indexOf, 1)
              menuSelectElTreeRef.value.setChecked(id, false, false)
            }
          })
          if (res.data) {
            const elementIds: Array<string> = res.data
            elementIds.forEach(id => {
              const indexOf = bindObj.elementIds.indexOf(id)
              if (indexOf !== -1) {
                bindObj.elementIds.splice(indexOf, 1)
              }
            })
          }
          ElMessage.success('操作成功')
        }
      }).catch(() => {
        // 操作失败还原数据
        menuSelectElTreeRef.value.setCheckedKeys(bindObj.menuIds)
      })
    }
    const unselectElement = (elementId: string) => {
      unbindRoleMenu(props.params.dataId, elementId, BindType.ELEMENT).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < bindObj.elementIds.length; i++) {
            if (bindObj.elementIds[i] === elementId) {
              bindObj.elementIds.splice(i, 1)
              break
            }
          }
          ElMessage.success('操作成功')
        }
      }).catch(() => {
        elementList.value.forEach(element => {
          if (element.id === elementId) {
            element.checked = true
            return
          }
        })
      })
    }
    // -------------------取消选择---------------------end

    const treeCheckChange = (data: MenuBeanVO, checkNode: boolean) => {
      if (checkNode) {
        return selectMenu(data)
      }
      elementList.value = []
      bindObj.clickMenuId = ''
      bindObj.clickMenuName = ''
      unselectMenu(data)
    }

    const elementChange = (checked: boolean | undefined, id: string) => {
      if (checked) {
        return selectElement(id)
      }
      unselectElement(id)
    }

    // 关闭窗口
    const handleClose = () => {
      menuList.value = []
      elementList.value = []
      const menuSize = bindObj.menuIds.length
      const elementSize = bindObj.elementIds.length
      Object.assign(bindObj, {
        menuIds: [],
        elementIds: [],
        clickMenuId: '',
        clickMenuName: '',
      })
      emit('close-dialog', menuSize, elementSize, props.params.dataId)
    }

    const handleOpen = () => {
      getRoleBindMenuByRoleId(props.params.dataId).then(res => {
        if (res.code === 200) {
          const data: Array<RoleMenuBean> = res.data
          bindObj.menuIds = data.filter(item => item.type === BindType.MENU).map(item => item.menuId)
          bindObj.elementIds = data.filter(item => item.type === BindType.ELEMENT).map(item => item.menuId)
          getMenuByItemCode().then(res2 => {
            if (res2.code === 200) {
              menuList.value = res2.data
            }
          })
        }
      })
    }

    return {
      visible,
      handleOpen,
      handleClose,
      menuSelectElTreeRef,
      menuList,
      treeCheckChange,
      elementList,
      bindObj,
      treeNodeClick,
      elementChange,
    }
  },
})

</script>


<style scoped lang="scss">
.menu-select-main{
  display: grid;
  grid-template-columns: 1fr 240px;
  align-items: flex-start;
  grid-gap: 20px;
  min-height: 46vh;
  & .menu-element{
    border: var(--border-1);
    border-radius: var(--border-radius-medium);
    & h5{
      padding: var(--pd-small);
      border-bottom: var(--border-1);
      & span{
        font-size: var(--h6-size);
        color: var(--el-text-color-placeholder);
      }
    }
    & li{
      padding-left: var(--pd-medium);
    }
    & li:not(:last-of-type){
      border-bottom: var(--border-1);
    }
    & .no-data{
      display: block;
      text-align: center;
      line-height: var(--size-medium);
    }
  }
}

.menu-index-tree{
  border: var(--border-1);
  border-bottom: 0;
  border-radius: var(--border-radius-medium);
  & .el-tree-node__content{
    border-bottom: var(--border-1);
  }

  & .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    line-height: var(--size-default);
  }
}
</style>
<style lang="scss">
.menu-index-tree{
  & .el-tree-node__content, .tree-bd, .el-tree__empty-block{
    border-bottom: var(--border-1);
  }
}
</style>