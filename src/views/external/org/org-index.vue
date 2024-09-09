<template>
  <div>
    <div class="mgb-medium org-toolbar">
      <el-button
        type="success"
        :icon="Plus"
        @click="dialogBaseOpen(undefined)"
      >
        创建一级机构
      </el-button>

      <el-button
        :icon="Plus"
        :disabled="!activeOrg.id"
        @click="dialogBaseOpen(undefined)"
      >
        创建子机构
      </el-button>

      <el-button
        :icon="Edit"
        :disabled="!activeOrg.id"
        @click="dialogBaseOpen(undefined)"
      >
        编辑选中机构
      </el-button>
      
      <el-button
        :icon="Delete"
        :disabled="!activeOrg.id && activeOrg.childrenCount === 0"
        @click="dialogBaseOpen(undefined)"
      >
        删除选中机构
      </el-button>
    </div>

    {{ activeOrg }}

    <org-tree
      ref="orgIndexTreeRef"
      :org-list="orgList"
      @set-active-org="treeCheckChange"
      @set-checked-keys="null"
    />

    <org-edit-dialog
      v-bind="dialogBase"
      @close-dialog="dialogBaseCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted,reactive, ref} from 'vue'
import {OrgBeanActive, OrgBeanVO} from './orgModel'
import {dialogBaseContent} from '@utils/dialogOptions'
import {deleteOrg, getOrgByItemCode} from './orgOption'
import {deleteConfirm} from '@utils/utils'
import OrgEditDialog from './org-edit-dialog.vue'
import {Delete, Edit, Plus, Search} from '@element-plus/icons-vue'
import OrgTree from './org-tree.vue'

export default defineComponent({
  name: 'OrgIndex',
  components: {
    OrgEditDialog,
    OrgTree,
  },
  setup(props, ctx) {
    const orgIndexTreeRef = ref()
    const orgList = ref<Array<OrgBeanVO>>([])

    const {
      dialogBase,
      dialogBaseOpen,
      dialogBaseCloseAndRefresh,
    } = dialogBaseContent<string>()

    // 右侧激活的菜单
    const activeOrg = reactive<OrgBeanActive>({
      id: '',
      name: '',
      code: '',
      childrenCount: 0,
    })
    const treeCheckChange = (data: OrgBeanActive) => {
      Object.assign(activeOrg, data)
    }

    const query = () => {
      // orgIndexTreeRef.value!.cleanActiveMenu(true)
      getOrgByItemCode().then(res => {
        if (res.code === 200) {
          orgList.value = res.data
        }
      })
    }
    
    const deleteData = (id: string) => {
      deleteConfirm('你确定要删除此用户吗？').then(flag => {
        if (flag) {
          deleteOrg(id).then(res => {
            if (res.code === 200) {
              query()
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

        treeCheckChange,
        orgIndexTreeRef,

        query,
        orgList,
        deleteData,
        activeOrg,

        dialogBase,
        dialogBaseOpen,
        dialogBaseCloseAndRefresh,
      }
  },
})
</script>

<style scoped lang="scss">

</style>