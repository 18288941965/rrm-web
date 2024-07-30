<template>
  <div class="item-body">
    <header class="item-header">
      <div>RRM</div>

      <div class="empty-flex" />

      <user-avatar
        :user-name="userInfoObj.userName"
        class="user-avatar-container arrow-down"
      >
        <template #summary>
          <PersonFill />
          <Expand
            :size="10"
            class="expand-mg"
          />
        </template>
      </user-avatar>
    </header>

    <main class="item-main">
      <div class="item-banner">
        <h2>选择你要管理的项目</h2>

        <el-button
          type="primary"
          @click="dialogBaseOpen(undefined)"
        >
          创建项目
        </el-button>
      </div>


      <div class="item-flex">
        <div
          v-for="(item, index) in itemList"
          :key="'item-' + index"
          class="item-card"
        >
          <div>
            <h4><a>项目名称</a></h4>
            <span class="item-cjrq">532626</span>
          </div>
          <p>TWL创建，2024-07-30</p>
          <el-button
            type="success"
            plain
            color="#333333"
          >
            进入
          </el-button>
        </div>
      </div>
    </main>

    <app-item-edit
      :data-id="dialogBase.dataId as number"
      :show="dialogBase.show"
      @close-dialog="dialogBaseCloseAndRefresh($event, query)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import {AxiosResult} from '@utils/interface'
import LocalStorage from '../../class/LocalStorage'
import {LoginSuccess} from '@utils/types'
import {RUEnum} from '../../router/routerModels'
import {useRouter} from 'vue-router'
import UserAvatar from '../../components/avatar/user-avatar.vue'
import {PersonFill} from '../../components/svicon/publicIcon'
import {Expand} from '../../components/svicon/publicIcon'
import appItemEdit from './app-item-edit.vue'
import {dialogBaseContent} from '@utils/dialogOptions'
import {ItemBean} from './itemModel'

export default defineComponent({
  name: 'AppItem',
  components: {
    PersonFill,
    UserAvatar,
    appItemEdit,
    Expand,
  },
  setup() {
    const router = useRouter()
    const local = new LocalStorage()
    const userInfoObj = local.getUserInfoObj()
    const itemList = ref<Array<ItemBean>>([])

    const {
      dialogBase,
        dialogBaseCloseAndRefresh,
        dialogBaseOpen,
    } = dialogBaseContent()

    // 选择任职机构成功的回调函数
    const loginSuccess: LoginSuccess = (data: AxiosResult) => {
      router.replace(RUEnum.HOME)
    }

    const query = () => {
      console.log('===')
    }

    onMounted(() => {
    })

    return {
      userInfoObj,
      itemList,
      query,
      dialogBase,
      dialogBaseOpen,
      dialogBaseCloseAndRefresh,
    }
  },
})
</script>

<style scoped lang="scss">
@use "@assets/scss/mixin/_mixin.scss" as *;

.item-body{
  & .item-header{
    @include flex-base();
    background-color: var(--bg-color-header);
    padding: 0 var(--pd-medium);
    border-bottom: var(--border-1);
    line-height: var(--header-height);
  }

  & .item-main{
    margin: auto;
    max-width: 1200px;

    & .item-banner{
      display: grid;
      grid-template-columns: 1fr 120px;
      align-items: center;
    }

    & h2{
      line-height: 100px;
    }

    & .item-flex{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      grid-gap: var(--mg-medium);
      min-height: 200px;
      border: var(--border-1) {
        radius: var(--border-radius-large);
      };
      padding: var(--pd-medium);
    }

    & .item-card{
      padding: var(--pd-medium);
      border: var(--border-1) {
        radius: var(--border-radius-medium);
      };
    }
  }
}

.user-avatar-container details{
  @include flex-base();
  height: var(--size-default);
  border: 0;
  background-color: var(--color-blue);
  padding: 0 var(--pd-ultra-small);
  border-radius: var(--border-radius-round-medium);
  color: var(--color-white);
  & summary{
    width: max-content;
  }
  & summary svg:nth-child(2){
    margin-left: var(--mg-small);
  }
}
</style>