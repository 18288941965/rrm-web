<template>
  <div class="dict-grid">
    <section class="layout-sidebar">
      <dict-type @set-dict-type="setDictType" />
    </section>
    <section class="layout-main">
      <dict-item :select-dict-type="selectDictType" />
    </section>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import DictType from './dict-type.vue'
import DictItem from './dict-item.vue'
import {DictTypeBeanVO} from './dictModel'

export default defineComponent({
  name: 'DictIndex',
  components: {
    DictType,
    DictItem,
  },
  setup() {
    const selectDictType = ref<DictTypeBeanVO>({
      description: '',
      id: 0,
      itemCount: 0,
      typeCode: '',
      typeName: '',
    })

    const setDictType = (obj: DictTypeBeanVO) => {
      selectDictType.value = obj
    }

      return {
        selectDictType,
        setDictType,
      }
  },
})
</script>

<style scoped lang="scss">
  .dict-grid{
    display: grid;
    grid-template-columns: 2fr 3fr;
    grid-column-gap: var(--mg-medium);
    & .layout-sidebar{
      padding-right: var(--pd-medium);
      border-right: 2px dotted var(--border-color);
    }
    & .layout-main{
    }
  }
</style>