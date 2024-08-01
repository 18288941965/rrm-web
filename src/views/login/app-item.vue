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
            <h4>{{ item.itemName }}</h4>
            <span class="item-code">{{ item.itemCode }}</span>
          </div>
          <p>{{ item.username }} {{ item.createTime }}</p>
          <el-button
            type="success"
            plain
            color="#333333"
            @click="select(item.itemCode, item.itemName)"
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
import {ItemBeanVO} from './itemModel'
import {getAllItem, selectItem} from './itemOption'
import {LSEnum} from './loginModels'
import BChannel from '@utils/channel/BChannel'
import {BCEnum} from "@utils/channel/channelModels";

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
    const itemList = ref<Array<ItemBeanVO>>([])

    const {
      dialogBase,
        dialogBaseCloseAndRefresh,
        dialogBaseOpen,
    } = dialogBaseContent()
    
    const {
      postMessage,
    } = BChannel()

    // 选择项目后回调函数
    const loginSuccess: LoginSuccess = (data: AxiosResult) => {
      local.setItem(data.data, data.message)
      local.setLoginStatus(LSEnum.LOG_IN)
      postMessage({ code: BCEnum.ITEM, message: '选择项目成功' })
      router.replace(RUEnum.HOME)
    }

    const query = () => {
      getAllItem().then(res => {
        if (res.code == 200) {
          itemList.value = res.data
        }
      })
    }

    const select = (itemCode: string, itemName: string) => {
      selectItem(itemCode).then(res => {
        if (res.code == 200) {
          res.data = itemCode
          res.message = itemName
          loginSuccess(res)
        }
      })
    }

    onMounted(() => {
      query()
    })

    return {
      userInfoObj,
      itemList,
      select,
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
    & h4{
      line-height: var(--size-default);
    }

    & .item-flex{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      grid-gap: var(--mg-medium);
      min-height: 200px;
      border: var(--border-1);
      border-radius: var(--border-radius-large);
      padding: var(--pd-medium);
    }

    & .item-card{
      padding: var(--pd-medium);
      border: var(--border-1);
      border-radius: var(--border-radius-medium);
      & .item-code, p{
        color: var(--color-black-secondary);
      }
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