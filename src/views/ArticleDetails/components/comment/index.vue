<template>
  <div>
    <div class="comment">
      <van-cell>
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px"
          :src="ele.aut_photo"
        />
        <span style="color: #466b9d">{{ ele.aut_name }}</span>
        <div>
          <p style="color: #363636">{{ ele.content }}</p>
          <p>
            <span style="margin-right: 10px">{{
              dayjs(ele.pubdate).fromNow()
            }}</span>
            <van-button size="small" type="default" @click="show = true"
              >回复{{ ele.reply_count }}</van-button
            >
          </p>
        </div>
        <van-icon
          @click="CommentsThumb(ele.com_id)"
          slot="right-icon"
          name="good-job-o"
          v-if="!ele.is_liking"
          >赞{{ ele.like_count }}</van-icon
        >
        <van-icon
          v-if="ele.is_liking"
          @click="noCommentsThumb(ele.com_id)"
          slot="right-icon"
          name="thumb-circle"
          color="#4dc4ff"
          >赞{{ ele.like_count }}</van-icon
        >
      </van-cell>
    </div>
    <van-popup
      v-model="show"
      position="bottom"
      class="pupop"
      :style="{ height: '100%' }"
      closeable
      close-icon-position="top-left"
    >
      <div class="comment">
        <van-cell>
          <van-image
            slot="icon"
            round
            width="30"
            height="30"
            style="margin-right: 10px"
            :src="ele.aut_photo"
          />
          <span style="color: #466b9d">{{ ele.aut_name }}</span>
          <div>
            <p style="color: #363636">{{ ele.content }}</p>
            <p>
              <span style="margin-right: 10px">{{
                dayjs(ele.pubdate).fromNow()
              }}</span>
              <van-button size="small" type="default" @click="show = true"
                >回复{{ ele.reply_count }}</van-button
              >
            </p>
          </div>
          <van-icon
            @click="CommentsThumb(ele.com_id)"
            slot="right-icon"
            name="good-job-o"
            v-if="!ele.is_liking"
            >赞{{ ele.like_count }}</van-icon
          >
          <van-icon
            v-if="ele.is_liking"
            @click="noCommentsThumb(ele.com_id)"
            slot="right-icon"
            name="thumb-circle"
            color="#4dc4ff"
            >赞{{ ele.like_count }}</van-icon
          >
        </van-cell>
      </div>
      <van-cell title="全部回复" />
      <van-cell v-for="(i, index) in list" :key="index">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px"
          :src="i.aut_photo"
        />
        <span style="color: #466b9d">{{ i.aut_name }}</span>
        <div>
          <p style="color: #363636">{{ i.content }}</p>
          <p>
            <span style="margin-right: 10px">{{
              dayjs(i.pubdate).fromNow()
            }}</span>
            <van-button size="small" type="default" @click="show = true"
              >回复{{ i.reply_count }}</van-button
            >
          </p>
        </div>
        <van-icon
          @click="CommentsThumb(i.com_id)"
          slot="right-icon"
          name="good-job-o"
          >赞{{ i.like_count }}</van-icon
        >
      </van-cell>
      <div class="popup-button">
        <van-button color="#fff" @click="show1 = true">评论</van-button>
      </div>
    </van-popup>
    <van-popup v-model="show1" position="bottom" :style="{ height: '20%' }">
      <div class="popup">
        <van-field
          v-model="message"
          rows="2"
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
        />
        <van-button
          @click="sendMessage"
          type="default"
          :disabled="!!!message.trim()"
          >发布</van-button
        >
      </div>
    </van-popup>
  </div>
</template>
<script>
import {
  articleReviews,
  setComment,
  CommentsThumb,
  noCommentsThumb
} from '@/api/journalism'
import dayjs from '@/utils/dayjs.js'
export default {
  data() {
    return {
      dayjs,
      show1: false,
      show: false,
      show2: false,
      show3: false,
      message: '',
      list: []
    }
  },
  props: {
    ele: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    // 获取评论回复
    async articleReviews() {
      const res = await articleReviews('c', this.ele.com_id)
      this.list = res.data.data.results
      //   console.log(this.list)
    },
    // 发布评论回复
    async sendMessage() {
      await setComment(this.ele.com_id, this.message, this.id)
      this.articleReviews()
      this.show1 = !this.show1
      this.message = ''
      this.$toast('发布成功')
      this.articleReviews()
    },
    // 点赞评论
    async CommentsThumb(id) {
      await CommentsThumb(id)
      this.articleReviews()
      this.$emit('CommentsThumb')
      //   console.log(res)
    },
    // 取消点赞评论
    async noCommentsThumb(id) {
      await noCommentsThumb(id)
      this.articleReviews()
      this.$emit('noCommentsThumb')
      //   console.log(res)
    }
  },
  created() {
    this.articleReviews()
  }
}
</script>

<style lang="less" scoped>
.van-list {
  margin-bottom: 45px;
}
.comment {
  .van-button--small {
    width: 60px;
    height: 20px;
    border-radius: 10px;
    margin-left: 20px;
  }
}
.pupop {
  .comment {
    margin-top: 50px;
  }
}
.popup-button {
  background-color: #466b9d;
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  text-align: center;
  :deep(.van-button) {
    width: 300px;
    padding: 10px;
    border-radius: 20px;
    span {
      color: #333;
    }
  }
}
.popup {
  display: flex;
  align-items: center;
  height: 100%;
  :deep(.van-field__value) {
    background-color: #e5e5e5;
    border-radius: 5px;
    padding: 10px;
  }
  .van-button--default {
    border: unset;
    white-space: nowrap;
    color: #3296fa;
  }
}
</style>
