<template>
  <div>
    <!-- 每一篇文章的结构 -->
    <van-pull-refresh
      v-model="refreshLoading"
      @refresh="loadNextPage"
      success-text="刷新成功~"
    >
      <van-list
        @load="loadNextPage"
        :immediate-check="false"
        v-model="loading"
        :Finished="isFinished"
        :error.sync="error"
        error-text="出错了，请重新加载!"
        finished-text="没有更多了~~~~~"
      >
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :articleInfo="item"
        ></ArticleItem
      ></van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 引入API
import { getArticleList } from '@/api/new.js'
// 引入组件
import ArticleItem from './ArticleItem.vue'

export default {
  components: {
    ArticleItem
  },
  props: {
    // 频道
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      articles: [],
      pre_timestamp: '',
      isFinished: false,
      loading: false,
      error: false,
      refreshLoading: false
    }
  },
  created() {
    this.getArticleList()
  },
  methods: {
    // 获取频道的文章并且处理文章数据
    async getArticleList() {
      try {
        const { data } = await getArticleList(this.id, +new Date())
        this.pre_timestamp = data.data.pre_timestamp
        this.articles = data.data.results
      } catch (error) {
        // 1.获取状态码
        const status = error.response.status

        if (status === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('获取文章列表失败，请重新刷新')
        }
      }
    },
    // 加载下一页频道数据
    async loadNextPage() {
      try {
        const { data } = await getArticleList(this.id, this.pre_timestamp)
        if (!data.data.pre_timestamp) {
          this.isFinished = true
        }
        // 将第n页的数据，放在articles
        if (this.refreshLoading) {
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
        // 更新页数
        this.pre_timestamp = data.data.pre_timestamp

        // loadinng设置为false
        // this.loading = false
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
        this.refreshLoading = false
      }
    }
  }
}
</script>

<style></style>
