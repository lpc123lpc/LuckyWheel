<template>
  <div class="login-container">
    <div class="form-container">
      <div style="font-size: 1.5rem;color: 	Beige">
        <div ref="login-box" class="login-tab">
          <span @click="setLoginStyle" style="margin: 0 auto;">登录</span>
        </div>
        <div ref="register-box" class="register-tab">
          <span @click="setRegisterStyle" style="margin: 0 auto;">注册</span>
        </div>
      </div>
      <el-form ref="loginForm" v-if="flag === 1" :model="form" label-width="4rem" label-position="top" :rules="rules" >
        <el-form-item>
          <span style="font-size: 2rem;color: Beige">LOGIN IN</span>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="form.username"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="form.password"
              show-password
              placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-button type="primary" plain @click="login">登录</el-button>
      </el-form>
      <el-form ref="registerForm" v-else-if="flag === 2" :model="registerForm" label-width="4rem" label-position="top" :rules="rules">
        <el-form-item>
          <span style="font-size: 2rem;color: Beige">REGISTER</span>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="registerForm.username"
                    placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              v-model="registerForm.password"
              show-password
              placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirm">
          <el-input
              v-model="registerForm.confirm"
              show-password
              placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-button type="primary" plain @click="register">注册</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data:function () {
    return {
      //默认是1，表示登录 2表示注册
      flag: 1,
      // 登录表单
      form: {
        username: null,
        password: null,
      },
      registerForm : {
        username: null,
        password: null,
        confirm: null,
      },
      // 返回值
      code: 0,
      userType: 0,
      // 表单校验
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        confirm: [{
          required: true,
          message: '请再次输入密码',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
    this.setLoginStyle()
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let that = this
          fetch('https://qc5plm.fn.thelarkcloud.com/login', {method: 'POST',
            body: JSON.stringify({
              'username': that.form.username,
              'password': that.form.password
            }),
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          }).then(function (response) {
            response.json().then((msg) => {
              that.code= msg.code
              that.userType = msg.userType
            }).then(() => {
              if (that.code === 1) {
                // console.log(that)
                that.$cookies.set("username",that.form.username,'1d')
                that.$cookies.set("userType",that.userType,'1d')
                that.user.nowUser = that.form.username
                that.user.nowUserType = that.form.userType
                if (that.userType === 0) {
                  that.$router.push({path:'/luckyWheel'})
                }
                else {
                  that.$router.push({path: '/server'})
                }
              }
              else {
                that.$message({
                  type: 'warning',
                  message: '密码错误或用户不存在'
                })
              }
            })
          }).catch(function (err) {
            alert(err.toString())
          })
        }
      })
    },
    setLoginStyle() {
      this.flag = 1
      this.$refs["login-box"].style.border = 'solid #B0C4DE'
      this.$refs["register-box"].style.border = '0'
    },
    setRegisterStyle() {
      this.flag = 2
      this.$refs["register-box"].style.border = 'solid #B0C4DE'
      this.$refs["login-box"].style.border = '0'
    },
    register() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          if (this.registerForm.password !== this.registerForm.confirm) {
            this.$message({
              type: 'warning',
              message: '请确保两次输入的密码一致'
            })
          }
          else {
            let that = this
            fetch('https://qc5plm.fn.thelarkcloud.com/register', {method: 'POST',
              body: JSON.stringify({
                username: that.registerForm.username,
                password: that.registerForm.password
              }),
              headers:new Headers({
                'Content-Type': 'application/json'
              })
            }).then(response => {
              response.json().then(msg => {
                if (msg.code === 0) {
                  this.$message({
                    type: 'warning',
                    message:'用户名已存在'
                  })
                }
                else {
                  this.$message({
                    type: 'success',
                    message:'注册成功'
                  })
                  this.setLoginStyle()
                }
              })
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.el-form {
  margin: auto;
  padding-left: 20%;
  padding-right: 20%;
}
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("https://p1.xywm.ltd/2021/07/24/a96a7a7ead7d0.png");
  background-size: cover;
}
.form-container {
  margin-top: 10rem;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  border: solid #B0C4DE;
}
.login-tab {
  display: inline-block;
  width: 49%;
}
.register-tab {
  display: inline-block;
  width: 49%;
}
</style>
