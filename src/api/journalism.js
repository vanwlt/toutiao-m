import request from '@/utils/request'

// 获取新闻详情
export const getJournalism = (id) => {
  return request({
    url: `/v1_0/articles/${id}`
  })
}
// 发表评论
export const setComment = (target, content, artId) => {
  return request({
    url: '/v1_0/comments',
    method: 'POST',
    data: {
      target,
      content,
      art_id: artId
    }
  })
}
// 收藏请求
export const CollectionArticles = (target) => {
  return request({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: {
      target
    }
  })
}
// 取消收藏请求
export const delCollectionArticles = (target) => {
  return request({
    url: `/v1_0/article/collections/${target}`,
    method: 'DELETE'
  })
}

// 获取文章评论
export const articleReviews = (type, source) => {
  return request({
    url: '/v1_0/comments',
    params: {
      type,
      source
    }
  })
}

// 文章评论
export const setArticleReviews = (target, content, artId) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data: {
      target,
      content,
      art_id: artId
    }
  })
}

// 评论点赞
export const CommentsThumb = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target
    }
  })
}

// 取消评论点赞
export const noCommentsThumb = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}
