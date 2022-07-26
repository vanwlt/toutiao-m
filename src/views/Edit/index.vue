<template>
  <div class="information">
    <!-- 导航栏 -->
    <van-nav-bar
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
      class="nav-bar"
    />

    <!-- 编辑头像 -->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 个人信息 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      @click="isUpdateNameShow = true"
      title="昵称"
      is-link
      :value="user.name"
    />
    <van-cell
      @click="isGenderShow = true"
      title="性别"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
    />

    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isBirthdayShow = true"
    />

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-if="isUpdateNameShow"
        v-model="user.name"
        @close="isUpdateNameShow = false"
      />
      <!-- 编辑性别 -->
    </van-popup>
    <van-popup v-model="isGenderShow" position="bottom" style="height: 50%">
      <update-gender
        v-if="isGenderShow"
        v-model="user.gender"
        @close="isGenderShow = false"
      />
    </van-popup>

    <!-- 编辑生日 -->
    <van-popup v-model="isBirthdayShow" position="bottom" style="height: 50%">
      <u-pdate-birthday
        v-if="isBirthdayShow"
        v-model="user.birthday"
        @close="isBirthdayShow = false"
      />
    </van-popup>
    <!-- 编辑头像 -->
    <van-popup v-model="isPhotoShow" position="bottom" style="height: 100%">
      <u-pdate-photo
        v-if="isPhotoShow"
        :img="img"
        @close="isPhotoShow = false"
        @update-photo="user.photo = $event"
      />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UPdateBirthday from './components/update-Birthday.vue'
import UPdatePhoto from './components/update-photo.vue'
export default {
  components: {
    UpdateName,
    UpdateGender,
    UPdateBirthday,
    UPdatePhoto
  },
  data() {
    return {
      user: [],
      isUpdateNameShow: false,
      isGenderShow: false,
      isBirthdayShow: false,
      isPhotoShow: false,
      img: null // 预览的图片
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
        // console.log(data)
      } catch (error) {
        this.$toast('获取数据失败')
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      // 展示图片预览弹出层
      this.isPhotoShow = true

      // file-input 如果选了同一个文件 就不会触发change 事件
      // 解决办法就是每次使用完毕，把它的value 清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
body,
html {
  background: #f5f7f9;
}

.information {
  :deep(.nav-bar) {
    background-color: #3296fa;
    position: relative;
    .van-nav-bar__title {
      color: #fff;
    }
    .van-icon {
      color: #fff;
    }
  }
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
