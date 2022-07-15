<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar
      class="navbar"
      title="登录"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #left> <van-icon name="cross" /></template
    ></van-nav-bar>
    <!-- 手机号/验证码 -->
    <van-form ref="loginFrom" @submit="login" class="from">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
        type="number"
        maxlength="11"
      >
        <template #label>
          <span class="toutiao tt-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
        type="number"
        maxlength="6"
      >
        <template #label>
          <span class="toutiao tt-yanzhengma"></span>
        </template>
        <template #right-icon>
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="code-btn"
            @click="onSendSms"
            size="mini"
            round
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <!-- 登录按钮 -->
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
import { mobileRules, codeRules } from './rules'
export default {
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isCountDownShow: false
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
    onSubmit(values) {
      console.log('submit', values)
    },

    // 登录
    async login() {
      this.$toast.loading({
        message: '加载中,请稍等...',
        forbidClick: true,
        duration: 2000
      })
      try {
        const res = await login(this.mobile, this.code)
        // console.log('登录成功', res)
        this.$store.commit('setUser', res.data.data)
        this.$router.push('/my')
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    },
    async onSendSms() {
      try {
        await this.$refs.loginFrom.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      this.isCountDownShow = true
      try {
        await sendSms(this.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (!err.response) {
          this.$toast.fail('手机格式不正确')
        } else {
          const status = err.response.status
          if (status === 400 || status === 429) {
            this.$toast.fail(err.response.data.message)
          }
        }
        // this.$toast.fail(message)
        // switch (status) {
        //   case 400:
        //     this.$toast.fail(err.response.data.message)
        //     break
        //   case 507:
        //     this.$toast.fail('发送太频繁了，请稍后重试')
        //     break
        //   default:
        //     this.$toast.fail('发送失败，请稍后重试')
        //     break
        // }
        // if (err.response.status === 429) {
        //   this.$toast.fail('发送太频繁了，请稍后重试')
        // } else {
        //   this.$toast.fail('发送失败，请稍后重试')
        // }
      }
    }
  }
}
</script>

<style scoped lang="less">
.navbar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}
.from {
  :deep(.van-field__label) {
    flex: 1;
  }
  :deep(.van-field__value) {
    flex: 20;
  }
  .toutiao {
    font-size: 0.49333rem;
  }
  .code-btn {
    background-color: #eee;
    padding: 0 10px;
    color: #666;
  }
}
</style>
