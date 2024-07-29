<template>
  <el-select
    v-bind="attrs"
    :key="uniqueKey"
    style="width: 100%"
    @change="updateSelectLabel"
  >
    <el-option
      v-for="item in dictList"
      :key="item.value"
      :value="item.value"
      :label="item.label"
    />
  </el-select>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import {ElSelect, ElOption} from 'element-plus/es'
import {defaultProps, LabelValue, uniqueKey, getEvElContext} from './evEl'

export default defineComponent({
  name: 'EvSelect',
  components: {
    ElSelect,
    ElOption,
  },
  props: {
    ...defaultProps,
    selectLabel: {
      type: [Array, String],
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

    const updateSelectLabel = (val: Array<string> | string) => {
      if (!dictList.value || !props.labelUpdate) {
        return
      }
      // 单选
      if (typeof val === 'string') {
        const obj = dictList.value.find(item => item.value === val)
        emit('update:selectLabel', obj ? obj.label : undefined)
        return
      }
      // 多选
      const labels: Array<string> = []
      val.forEach(value => {
        const obj = dictList.value.find(item => item.value === value) as LabelValue
        labels.push(obj.label)
      })
      emit('update:selectLabel', labels)
    }

    onMounted(() => {
      if (props.dictType) {
        return getDataByDictType(props.dictType)
      }

      if (props.reqUrl) {
        return getDataByReqUrl(props.reqUrl, props.defaultAttr as LabelValue)
      }

      if (props.dataList) {
        getDataByDataList(props.dataList, props.defaultAttr as LabelValue)
      }
    })

    return {
      attrs,
      updateSelectLabel,
      dictList,
      uniqueKey,
    }
  },
})
</script>
