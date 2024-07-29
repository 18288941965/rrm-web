<template>
  <div class="pd-m">
    <h3>
      基于 Element Plus → Checkbox 二次封装的选择器，对不同的数据选择做统一处理。
    </h3>

    <section>
      <p>根据字典类型获取数据</p>
      <div class="ev-comp-demo-grid2">
        <ev-checkbox
          v-model="evSelectValue.value"
          dict-type="ev_dict_demo"
        />
        <span>{{ evSelectValue.valueText }}</span>
      </div>
    </section>

    <section>
      <p>根据URL获取数据</p>
      <div class="ev-comp-demo-grid2">
        <ev-checkbox
          v-model="evSelectValue.value2"
          v-model:select-label="evSelectValue.value2Text"
          req-url="/admin/getDict2"
          :default-attr="{ label: 'mc', value: 'dm' }"
          :label-update="true"
          clearable
        />
        <span>{{ evSelectValue.value2Text }}</span>
      </div>
    </section>

    <section>
      <p>根据已有数据加载</p>
      <div class="ev-comp-demo-grid2">
        <ev-checkbox
          v-model="evSelectValue.value3"
          v-model:select-label="evSelectValue.value3Text"
          :data-list="evSelectValue.dataList"
          :default-attr="{ label: 'mc', value: 'dm' }"
          :label-update="true"
          multiple
          clearable
        />
        <span>{{ evSelectValue.value3Text }}</span>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue'
import EvCheckbox from '../../components/evcomp/ev-checkbox.vue'

export default defineComponent({
  name: 'EvCheckboxDemo',
  components: {
    EvCheckbox,
  },
  setup () {
    const evSelectValue = reactive({
      value: [],
      valueText: [],
      value2: [],
      value2Text: [],
      value3: [],
      value3Text: [],
      dataList: [
        { mc: '1号', dm: '01' },
        { mc: '2号', dm: '02' },
        { mc: '3号', dm: '03' },
        { mc: '4号', dm: '04' },
      ],
    })
    return {
      evSelectValue,
    }
  },
})
</script>

<style scoped>
  section{
    margin-top: 20px;
  }
  .ev-comp-demo-grid2{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
  }
</style>