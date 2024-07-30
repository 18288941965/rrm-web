<template>
  <el-dialog
    v-model="visible"
    title="项目编辑"
    width="720"
    :before-close="handleClose"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @open="handleOpen"
  >
    <el-form
      :model="form"
      label-width="auto"
      style="max-width: 600px"
    >
      <el-form-item
        label="项目代码"
        prop="itemCode"
      >
        <el-input
          v-model="form.itemCode"
          clearable
          placeholder="项目唯一标识，后续不能更改"
        />
      </el-form-item>
      <el-form-item
        label="项目名称"
        prop="itemName"
      >
        <el-input
          v-model="form.itemName"
          clearable
          placeholder=""
        />
      </el-form-item>
      
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, ref, watch, reactive} from 'vue'
import {ItemBean} from './itemModel'
import {createItem, updateItem} from './itemOption'
import {ElMessage} from 'element-plus/es'

export default defineComponent({
  props: {
    dataId: {
      type: Number,
      default: 0,
    },
    show: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  emits: ['close-dialog'],
  setup(props, {emit}) {
    const visible = ref(false)
    const refresh = ref(false)

    watch(
        () => props.show,
        () => {
          visible.value = props.show
        },
    )

    const form = reactive<ItemBean>({
      id: 0,
      itemName: '',
      itemCode: '',
    })

    // 关闭窗口
    const handleClose = () => {
      Object.assign(form, {
        id: 0,
        itemName: '',
        itemCode: '',
      })
      const tmp = refresh.value
      refresh.value = false
      emit('close-dialog', tmp)
    }

    const onSubmit = () => {
      if (form.id > 0) {
        updateItem(form)
      } else {
        createItem(form).then(res => {
          if (res.code == 200) {
            ElMessage.success(res.message)
            refresh.value = true
            handleClose()
          }
        })
      }
    }

    const handleOpen = () => {
      if (props.dataId) {
        form.id = props.dataId
      }
    }

    return {
      visible,
      form,
      handleOpen,
      handleClose,
      onSubmit,
    }
  },
})

</script>


<style scoped lang="scss">

</style>