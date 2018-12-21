<template>
  <div class="login">
     <!--
      el-form：整个form组件
      :model="form" ： 必须提供的对象
      label-width="80px"： label宽度

      el-form-item: 一个表单项

      element-ui中所有的组件在渲染的时候，这个组件名其实就是类名

      表单校验:
        1.给el-form传入一个rules规则
        2.要给el-form-item添加一个prop

     -->
    <el-form status-icon ref="form" :rules="rules" :model="form" label-width="80px">
      <img src="@/assets/1.jpg" alt="">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名">></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login">登录</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
</el-form>
  </div>
</template>

<script>
// 导入axios
import axios from 'axios'
export default {
  data() {
    return {
      // 收集表单数据
      form: {
        username: '',
        password: ''
      },
      // 表单的校验规则
      rules: {
        username: [
          // 非空校验
          { required: true, message: '用户名不能为空', trigger: 'change' },
          {
            min: 4,
            max: 10,
            message: '用户名长度在 4 到 10 个字符',
            trigger: 'change'
          }
        ],
        password: [
          // 非空校验
          { required: true, message: '密码不能为空', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '用户名长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },

  methods: {
    // 获取到整个表单组件,重置
    reset() {
      this.$refs.form.resetFields()
    },
    login() {
      // 让整个表单校验
      this.$refs.form.validate(valid => {
        // valid如果为true,就表示通过,否则不通过
        if (valid) {
          // 发送ajax请求,进行登录
          axios({
            method: 'post',
            url: 'http://localhost:8888/api/private/v1/login',
            data: this.form
          }).then(res => {
            console.log(res.data)
            if(res.data.meta.status === 200){
              // 跳转到主页
              // 参数:跳转的页面
              this.$router.push('/home')
              // 把后台颁发的token存起来
              localStorage.setItem('token',res.data.data.meta)
              // alert('登录成功')
              this.$message.success('登录成功')
            }else{
              // 失败的消息 this.$message:弹出一个消息框
              this.$message({
                message:res.data.meta.msg,
                type:'error',
                duration:1000
              })

            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less">
// 注意：vue-cli把所有的loader都配置好了，但是没有把依赖项全部都下载下来
.login {
  height: 100%;
  width: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    border-radius: 15px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px;
    position: relative;
    img {
      width: 100px;
      height: 100px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -70px;
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button:nth-child(2) {
      margin-left: 80px;
    }
  }
}
</style>
