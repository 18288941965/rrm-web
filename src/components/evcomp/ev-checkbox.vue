<template>
  <el-checkbox-group
    v-if="dictList.length > 0"
    v-bind="attrs"
    :key="uniqueKey"
    @change="updateSelectLabel"
  >
    <el-checkbox
      v-for="item in dictList"
      :key="item.value"
      :border="border"
      :value="item.value"
      :label="item.label"
    />
  </el-checkbox-group>
</template>

<script lang="ts">
import {defineComponent, onMounted} from 'vue'
import {defaultProps, LabelValue, uniqueKey, getEvElContext} from './evEl'
import {ElCheckboxGroup, ElCheckbox} from 'element-plus'
import {CheckboxValueType} from 'element-plus/es/components/checkbox/src/checkbox'

export default defineComponent({
  name: 'EvCheckbox',
  components: {
    ElCheckboxGroup,
    ElCheckbox,
  },
  props: {
    ...defaultProps,
    selectLabel: {
      type: Array,
      default: undefined,
    },
    border: {
      type: Boolean,
      default: true,
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

    const updateSelectLabel = (val: CheckboxValueType[]) => {
      if (!dictList.value || !props.labelUpdate) {
        return
      }

      const labels: Array<string> = []
      val.forEach(value => {
        const obj = dictList.value.find(item => item.value === value) as LabelValue
        labels.push(obj.label)
      })
      emit('update:selectLabel', labels)
    }

    onMounted(() => {
      if (props.dictType) {
        return getDataByDictType(props.dictType, props.defaultAttr as LabelValue)
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
      uniqueKey,
      updateSelectLabel,
      dictList,
    }
  },
})
</script>
