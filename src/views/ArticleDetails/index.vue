<template>
  <div>
    <van-nav-bar title="黑马头条" left-arrow @click-left="onClickLeft" />
    <!-- 标题 -->
    <div class="title">
      <van-cell :title="journalismDetails.title" />
    </div>
    <!-- 作者信息 -->
    <div class="aut-data">
      <div class="aut-data-name">
        <div class="aut-data-img">
          <van-image
            round
            cover
            width="1.1rem"
            height="1.1rem"
            :src="journalismDetails.aut_photo"
          />
        </div>
        <div>
          <p>{{ journalismDetails.aut_name }}</p>
          <span>{{ dayjs(journalismDetails.pubdate).fromNow() }}</span>
        </div>
      </div>
      <div class="aut-data-but">
        <van-button
          type="primary"
          v-if="!journalismDetails.is_followed"
          icon="plus"
          round
          class="no-btn"
          @click="attentionBtn"
          :loading="onloading"
          >关注</van-button
        >
        <van-button
          type="primary"
          v-else
          round
          class="yes-btn"
          :loading="onloading"
          @click="unfollowBtn"
          >已关注</van-button
        >
      </div>
    </div>
    <!-- 文章详情 -->
    <div class="contentsOfArticle">
      <article
        class="markdown-body"
        style="text-align: left"
        v-html="journalismDetails.content"
      ></article>
    </div>
    <!-- 底部操作 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="show = true"
        >写评论</van-button
      >
      <van-icon name="comment-o" :badge="commentList.length" color="#777" />
      <van-icon
        color="#777"
        name="star-o"
        @click="CollectionArticles"
        v-if="!journalismDetails.is_collected"
      />
      <van-icon
        name="star"
        color="#3296fa"
        v-if="journalismDetails.is_collected"
        @click="delCollectionArticles"
      />
      <van-icon color="#777" name="good-job-o" />
      <!-- <van-icon name="thumb-circle" color="#3296fa" /> -->
      <van-icon
        name="share"
        color="#777777"
        @click="showShare = true"
      ></van-icon>
    </div>
    <!-- 评论弹出层 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '20%' }">
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
          type="default"
          :disabled="!!!message.trim()"
          @click="sendMessage"
          >发布</van-button
        >
      </div>
    </van-popup>
    <!-- 分享面板 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
    />
    <!-- 正文结束 -->
    <div class="sedSegmentation"><van-divider>正文结束</van-divider></div>
    <!-- 评论 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment
        @noCommentsThumb="noCommentsThumb"
        @CommentsThumb="CommentsThumb"
        v-for="(ele, index) in commentList"
        :key="index"
        :ele="ele"
        :id="journalismDetails.art_id"
      ></comment>
      <!-- <van-cell
        v-for="(ele, index) in commentList"
        :key="index"
      ></van-cell> -->
    </van-list>
  </div>
</template>

<script>
import comment from './components/comment'
import dayjs from '@/utils/dayjs.js'
import {
  getJournalism,
  setComment,
  CollectionArticles,
  delCollectionArticles,
  articleReviews
} from '@/api/journalism'
import { attention, unfollow } from '@/api/user'
export default {
  data() {
    return {
      id: '',
      dayjs,
      journalismDetails: {},
      finished: false,
      show: false,
      message: '',
      showShare: false,
      onloading: false,
      loading: false,
      commentList: [],
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' }
      ]
    }
  },
  components: {
    comment
  },
  created() {
    this.id = this.$router.currentRoute.params.id
    this.getJournalism()
  },
  methods: {
    // 左侧按钮点击事件
    onClickLeft() {
      this.$router.go(-1)
    },
    // 获取文章详情
    async getJournalism() {
      const res = await getJournalism(this.id)
      this.journalismDetails = res.data.data
      //   console.log(this.journalismDetails)
      this.articleReviews()
    },
    // 关注按钮点击事件
    async attentionBtn() {
      this.onloading = true
      await attention(this.journalismDetails.aut_id)
      this.getJournalism()
      this.onloading = false
    },
    // 取消关注按钮点击事件
    async unfollowBtn() {
      this.onloading = true
      await unfollow(this.journalismDetails.aut_id)
      this.getJournalism()
      this.onloading = false
    },
    // 发布评论
    async sendMessage() {
      await setComment(this.journalismDetails.art_id, this.message)
      this.articleReviews()
      this.show = !this.show
      this.message = ''
      this.$toast('发布成功')
    },
    // 取消收藏文章
    async delCollectionArticles() {
      await delCollectionArticles(this.journalismDetails.art_id)
      this.getJournalism()
      this.$toast('取消收藏成功')
    },
    // 收藏文章
    async CollectionArticles() {
      await CollectionArticles(this.journalismDetails.art_id)
      this.getJournalism()
      this.$toast('收藏成功')
    },
    // 文章评论
    async articleReviews() {
      this.loading = true
      try {
        const res = await articleReviews('a', this.journalismDetails.art_id)
        this.commentList = res.data.data.results
        this.loading = false
        this.finished = true
        // console.log(this.commentList)
      } catch (err) {
        this.loading = false
        this.finished = true
      }
    },
    // 评论触底刷新
    onLoad() {
      // console.log(111)
    },
    noCommentsThumb() {
      this.getJournalism()
    },
    CommentsThumb() {
      this.getJournalism()
    }
  }
}
</script>

<style lang="less" scoped>
body {
  background-color: #fff;
}
.container {
  .sedSegmentation {
    padding-bottom: 60px;
    color: #666;
  }
}
p {
  margin: 0;
  padding: 0;
}
:deep(.van-nav-bar) {
  .van-icon {
    color: #fff;
  }
}
.van-nav-bar {
  background-color: #3296fa;
}
:deep(.van-nav-bar__title) {
  color: #fff;
}
.title {
  .van-cell {
    font-weight: 700;
    color: rgb(2, 2, 2);
    font-size: 0.53333rem;
    padding-top: 20px;
  }
}
.aut-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.53333rem 20px;
  .aut-data-name {
    display: flex;
    font-size: 13px;
    align-items: center;
    .aut-data-img {
      margin-right: 5px;
    }
    span {
      color: #666;
      margin-top: 2px;
    }
  }
  .van-button--round {
    font-size: 12px;
    border: unset;
    width: 80px;
    height: 28px;
  }
  .no-btn {
    background-color: #3296fa;
    color: #fff;
  }
  .yes-btn {
    background-color: #fff;
    color: #3296fa;
  }
}
.contentsOfArticle {
  article {
    padding: 20px;
  }
}
.article-bottom {
  z-index: 222;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 12px;
      background-color: #e22829;
    }
  }
}
// 评论弹出层
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
</style>
