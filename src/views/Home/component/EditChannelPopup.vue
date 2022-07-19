<template>
  <van-popup
    v-model="isShow"
    position="bottom"
    :style="{ height: '100%' }"
    closeable
  >
    <div class="popupMain">
      <div class="my-channel">
        <van-cell title="我的频道">
          <van-button
            size="small"
            round
            class="edit-btn"
            @click="isEdit = !isEdit"
            >{{ isEdit ? '完成' : '编辑' }}</van-button
          >
        </van-cell>

        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="(item, index) in myChannels"
            :key="item.id"
            :text="item.name"
            :class="{ 'active-channel': item.name === '推荐' }"
            @click="onClickMyChannel(item, index)"
            ><template #icon>
              <van-icon
                v-show="isEdit && item.name !== '推荐'"
                name="cross"
              /> </template
          ></van-grid-item>
        </van-grid>
      </div>

      <div class="recommend-channel">
        <van-cell title="推荐频道"></van-cell>
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="item in recommendChannels"
            :key="item.id"
            :text="item.name"
            icon="plus"
            @click="addMyChannel(item)"
          ></van-grid-item
        ></van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  props: {
    myChannels: {
      type: Array,
      required: true
    }
  },
  created() {
    this.getAllChannels()
  },
  data() {
    return {
      isShow: false,
      allChannels: [],
      // 用于标记是否处于编辑状态
      isEdit: false
    }
  },
  methods: {
    async getAllChannels() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    // 点击我的频道
    onClickMyChannel(item, index) {
      // 边缘情况的判断
      if (this.isEdit && item.name !== '推荐') {
        // 删除
        this.$emit('del-mychanel', item.id)
      }
      if (!this.isEdit) {
        // 切换
        this.isShow = false
        this.$emit('changeactive', index)
      }
    },
    // 添加频道
    addMyChannel(myChannel) {
      console.log(1)
      this.$emit('add-mychannel', { ...myChannel })
    }
  },
  computed: {
    recommendChannels() {
      return this.allChannels.filter(
        (item) => !this.myChannels.find((i) => i.id === item.id)
      )
    }
  }
}
</script>

<style scoped lang="less">
.popupMain {
  padding-top: 100px;
  // 按钮的样式
  .edit-btn {
    color: red;
    padding: 0 30px;
    height: 48px;
    border: 0.02667rem solid red;
  }
  // 我的频道的样式
  .my-channel {
    :deep(.van-grid-item__content) {
      position: relative;

      .van-grid-item__icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;

        .van-icon-cross {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(20%, -35%);
          border: 0.02667rem solid #000;
          border-radius: 50%;
          text-align: center;
          line-height: 0.32rem;
          font-size: 20px;
        }
      }
    }
  }
  // 推荐频道的样式
  .recommend-channel {
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      flex-direction: row;

      .van-grid-item__icon {
        font-size: 0.5rem;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
  .active-channel {
    :deep(.van-grid-item__text) {
      color: red;
    }
  }
}
</style>
