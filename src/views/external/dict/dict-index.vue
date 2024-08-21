<template>
  <div class="dict-grid">
    <section class="layout-sidebar">
      <dict-type
        ref="dictTypeRef"
        @set-dict-type="setDictType"
      />
    </section>
    <section>
      <dict-entry
        :select-dict-type="selectDictType"
        @set-entry-count="setEntryCount"
      />
    </section>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import DictType from './dict-type.vue'
import DictEntry from './dict-entry.vue'
import {DictTypeBeanVO} from './dictModel'

export default defineComponent({
  name: 'DictIndex',
  components: {
    DictType,
    DictEntry,
  },
  setup() {
    const selectDictType = ref<DictTypeBeanVO>({
      description: '',
      id: 0,
      entryCount: 0,
      typeCode: '',
      typeName: '',
    })

    const dictTypeRef = ref()

    const setDictType = (obj: DictTypeBeanVO) => {
      selectDictType.value = obj
    }

    const setEntryCount = (flag: number) => {
      dictTypeRef.value.setEntryCount(selectDictType.value.id, flag)
    }

      return {
        selectDictType,
        setDictType,
        setEntryCount,
        dictTypeRef,
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
      border-right: 1px dotted var(--border-color);
    }
  }
</style>