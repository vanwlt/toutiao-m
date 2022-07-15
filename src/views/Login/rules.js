export const mobileRules = [
  {
    required: true,
    message: '手机号不能为空'
  },
  {
    pattern: /^(0|86|17951)?(13[0-9]|15[012356789166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
    message: '手机格式错误'
  }

]
export const codeRules = [
  {
    required: true,
    message: '验证码不能为空'
  },
  {
    pattern: /^\d{6}$/,
    message: '验证码格式错误'
  }
]
