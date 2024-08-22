<template>
  <el-radio-group
    v-bind="attrs"
    :key="uniqueKey"
    @change="updateSelectLabel"
  >
    <slot name="custom" />
    <el-radio
      v-for="item in dictList"
      :key="item.value"
      :border="border"
      :value="item.value"
    >
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import {ElRadioGroup, ElRadio} from 'element-plus/es'
import {defaultProps, uniqueKey, getEvElContext, LabelValue} from './evEl'
import {RadioValType} from '@utils/types'

export default defineComponent({
  name: 'EvRadio',
  components: {
    ElRadioGroup,
    ElRadio,
  },
  props: {
    ...defaultProps,
    border: {
      type: Boolean,
      default: true,
    },
    selectLabel: {
      type: String,
      default: undefined,
    },
  },
  emits: ['update:selectLabel'],
  setup (props, { attrs, emit }) {
    const {
      dictList,
      getDataByDictType,
      getDataByReqUrl,
      getDataByDataList,
    } = getEvElContext()

    const updateSelectLabel = (val: RadioValType) => {
      if (!dictList.value || !props.labelUpdate) {
        return
      }
      const obj = dictList.value.find(item => item.value === val)
      emit('update:selectLabel', obj ? obj.label : undefined)
    }

    onMounted(() => {
      if (props.dictType) {
        return getDataByDictType(props.dictType, props.defaultAttr as LabelValue)
      }

      if (props.reqUrl) {
        return getDataByReqUrl(props.reqUrl, props.defaultAttr as LabelValue)
      }

      if (props.dataList) {
        return getDataByDataList(props.dataList, props.defaultAttr as LabelValue)
      }
    })

    return {
      attrs,
      uniqueKey,
      updateSelectLabel,
      dictList,
    }
  },
})
</script>
