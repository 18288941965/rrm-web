<template>
  <div>
    <div class="mgb-medium org-toolbar">
      <el-button
        type="success"
        :icon="Plus"
        @click="dialogParamsOpen({ dataId: '' })"
      >
        创建一级机构
      </el-button>

      <el-button
        :icon="Plus"
        :disabled="!activeOrg.id"
        @click="dialogParamsOpen({ dataId: '', parentCode: activeOrg.code, parentName: activeOrg.name })"
      >
        创建子机构
      </el-button>

      <el-button
        :icon="Edit"
        :disabled="!activeOrg.id"
        @click="dialogParamsOpen({ dataId: activeOrg.id })"
      >
        编辑选中机构
      </el-button>
      
      <el-button
        :icon="Delete"
        :disabled="!activeOrg.id || activeOrg.childrenCount > 0"
        @click="deleteData"
      >
        删除选中机构
      </el-button>
    </div>

    <org-tree
      ref="orgIndexTreeRef"
      :org-list="orgList"
      @set-active-org="treeCheckChange"
      @set-checked-keys="null"
    />

    <org-edit-dialog
      v-bind="dialogParam"
      @close-dialog="dialogParamsCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from 'vue'
import {OrgBeanActive, OrgBeanVO} from './orgModel'
import {dialogParamsContent} from '@utils/dialogOptions'
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
  setup() {
    const orgIndexTreeRef = ref()
    const orgList = ref<Array<OrgBeanVO>>([])

    const {
      dialogParam,
      dialogParamsOpen,
      dialogParamsCloseAndRefresh,
    } = dialogParamsContent()

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
      orgIndexTreeRef.value!.cleanActiveOrg(true)
      getOrgByItemCode().then(res => {
        if (res.code === 200) {
          orgList.value = res.data
        }
      })
    }
    
    const deleteData = () => {
      deleteConfirm('你确定要删除此机构吗？').then(flag => {
        if (flag) {
          deleteOrg(activeOrg.id).then(res => {
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

        dialogParam,
        dialogParamsOpen,
        dialogParamsCloseAndRefresh,
      }
  },
})
</script>

<style scoped lang="scss">

</style>