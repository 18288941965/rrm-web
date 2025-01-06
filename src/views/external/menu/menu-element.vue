<template>
  <div class="menu-element">
    <div class="control-top">
      <h5>菜单控件管理</h5>
      <el-button
        :icon="Plus"
        :disabled="!activeMenu.id"
        @click="dialogParamsOpen({ dataId: undefined, menuId: activeMenu.id })"
      >
        创建控件
      </el-button>
    </div>
    <div class="control-main">
      <p>控件管理包括菜单下的按钮、标签页、链接等，对各类控件绑定资源达到更精细的权限控制。</p>
      <ul>
        <li
          v-for="(element, index) in dataList"
          :key="'element-' + index"
        >
          <span>{{ element.name }}</span>
          <div>
            <span class="element-key">ID：{{ element.id }}</span>
            <el-switch
              v-model="element.status"
              inline-prompt
              :active-value="1"
              :inactive-value="0"
              active-text="启用"
              inactive-text="停用"
              class="mgr-medium"
              @change="updateStatus($event, element.id)"
            />

            <el-button
              :icon="Edit"
              @click="dialogParamsOpen({ dataId: element.id, menuId: activeMenu.id })"
            />
            <el-button
              :icon="Delete"
              @click="deleteData(element.id, element.name)"
            />
            <el-button
              :icon="Link"
              @click="dialogBindResourceOpen({ dataId: element.id, name: activeMenu.name + '（' + element.name + '）', type: '02' })"
            >
              绑定资源 {{ resourceCount }} / <span class="bind-source">{{ element.bindResourceCount }}</span>
            </el-button>
          </div>
        </li>
      </ul>
    </div>
    
    <menu-element-edit-dialog
      v-bind="dialogParam"
      @close-dialog="dialogParamsCloseAndRefresh($event, query)"
    />

    <resource-select-dialog
      v-bind="dialogBindResource"
      @close-dialog="dialogBindResourceCloseAndRefresh"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, ref, watchEffect} from 'vue'
import {Delete, Edit, Link, Plus} from '@element-plus/icons-vue'
import {MenuBeanActive, MenuElementBeanVO} from './menuModel'
import MenuElementEditDialog from './menu-element-edit-dialog.vue'
import {dialogParamsContent} from '@utils/dialogOptions'
import {
  countMenuBindResourceByMenuId,
  deleteMenuElementById,
  getMenuElementByMenuId,
  updateMenuElementStatus,
} from './menuOption'
import {deleteConfirmContent} from '@utils/utils'
import ResourceSelectDialog from '../resource/resource-select-dialog.vue'
import {ElMessage} from 'element-plus/es'

export default defineComponent({
  name: 'MenuElement',
  components: {
    MenuElementEditDialog,
    ResourceSelectDialog,
  },
  props: {
    activeMenu: {
      type: Object as PropType<MenuBeanActive>,
      default: () => {
        return {
          id: '',
          name: '',
          childrenCount: 0,
        }
      },
    },
    resourceCount: {
      type: Number,
      default: 0,
    },
  },
  emits: ['set-element-count'],
  setup(props, { emit }) {
    const dataList = ref<Array<MenuElementBeanVO>>([])
    
    const query = () => {
      getMenuElementByMenuId(props.activeMenu.id).then(res => {
        if (res.code === 200) {
          dataList.value = res.data
          dataList.value.forEach(element => {
            countMenuBindResourceByMenuId(element.id).then(res => {
              if (res.code === 200) {
                element.bindResourceCount = res.data
              }
            })
          })
          emit('set-element-count', dataList.value.length)
        }
      })
    }

    const deleteData = (id: string, name: string) => {
      deleteConfirmContent('建议停用控件而不是删除，删除将会清空相关信息且不可恢复，你确定要执行删除操作吗？', name).then(data => {
        if (data) {
          deleteMenuElementById(id).then(res => {
            if (res.code === 200) {
              ElMessage.success(res.message)
              for (let i = 0; i < dataList.value.length; i++) {
                if (dataList.value[i].id === id) {
                  dataList.value.splice(i, 1)
                  break
                }
              }
            }
          })
        }
      })
    }

    const {
      dialogParam,
        dialogParamsOpen,
        dialogParamsCloseAndRefresh,
    } = dialogParamsContent()

    watchEffect(() => {
      if (props.activeMenu.id) {
        query()
      } else  {
        dataList.value = []
      }
    })

    // ————————菜单绑定资源————————start
    const {
      dialogParam: dialogBindResource,
      dialogParamsOpen: dialogBindResourceOpen,
      dialogParamsClose: dialogBindResourceClose,
    } = dialogParamsContent()
    const dialogBindResourceCloseAndRefresh = (refresh: boolean, size: number, id: string) => {
      dialogBindResourceClose()
      if (refresh) {
        dataList.value.forEach(item => {
          if (item.id === id) {
            item.bindResourceCount = size
            return
          }
        })
      }
    }
    // ————————菜单绑定资源————————end

    const updateStatus = (status: number, id: string) => {
      updateMenuElementStatus(status, id).then(res => {
        if (res.code === 200) {
          ElMessage.success('操作成功！')
        }
      }).catch(() => query())
    }

      return {
        Edit,
        Delete,
        Plus,
        Link,
        dataList,
        query,
        deleteData,
        updateStatus,

        dialogParam,
        dialogParamsOpen,
        dialogParamsCloseAndRefresh,

        dialogBindResource,
        dialogBindResourceOpen,
        dialogBindResourceCloseAndRefresh,
      }
  },
})
</script>

<style scoped lang="scss">

  .menu-element{
    & .control-top{
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: var(--size-medium);
      border-bottom: var(--border-1);
      padding-left: var(--pd-medium);
      padding-right: var(--pd-ultra-small);
      border-top: var(--border-1);
    }
    & p{
      text-indent: 2rem;
      color: var(--color-black-secondary);
    }

    & .control-main{
      padding: var(--pd-medium);
      & .bind-source{
        padding-left: var(--pd-ultra-small);
        font-weight: bolder;
      }
      & p{
        text-indent: 2rem;
        color: var(--color-black-secondary);
      }
      & .element-key{
        display: inline-block;
        margin-right: var(--mg-medium);
        color: var(--color-black-secondary);
      }
      & ul li{
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: var(--size-medium);
        padding: 0 var(--pd-ultra-small);
        background-color: var(--bg-color-header);
        margin-bottom: var(--mg-ultra-small);
        border-radius: var(--border-radius-medium);
        box-shadow: var(--box-shadow-small);
      }
    }
  }

</style>