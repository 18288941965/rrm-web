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
            <el-button
              :icon="Edit"
              @click="dialogParamsOpen({ dataId: element.id, menuId: activeMenu.id })"
            />
            <el-button
              :icon="Delete"
              @click="deleteData(element.id)"
            />
            <el-button
              :icon="Link"
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
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, ref, watchEffect} from 'vue'
import {Delete, Edit, Link, Plus} from '@element-plus/icons-vue'
import {MenuBeanActive, MenuElementBean} from './menuModel'
import MenuElementEditDialog from './menu-element-edit-dialog.vue'
import {dialogParamsContent} from '@utils/dialogOptions'
import {countMenuBindResourceByMenuId, deleteMenuElementById, getMenuElementByMenuId} from './menuOption'
import {deleteConfirm} from '@utils/utils'

export default defineComponent({
  name: 'MenuElement',
  components: {
    MenuElementEditDialog,
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
  setup(props) {
    const dataList = ref<Array<MenuElementBean>>([])
    
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
        }
      })
    }

    const deleteData = (id: string) => {
      deleteConfirm('你确定要删除此控件吗？关联的资源也将被清空').then(data => {
        if (data) {
          deleteMenuElementById(id).then(res => {
            if (res.code === 200) {
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

      return {
        Plus,
        Link,
        dataList,
        query,
        deleteData,
        dialogParam,
        dialogParamsOpen,
        dialogParamsCloseAndRefresh,
      }
  },
  computed: {
    Edit() {
      return Edit
    },
    Delete() {
      return Delete
    },
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