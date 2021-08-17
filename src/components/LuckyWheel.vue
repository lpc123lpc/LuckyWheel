<template>
  <div class="hello" >
    <el-button v-if="userType === '1'" type="text" style="margin-left: 60%;color: #B0C4DE" @click="gotoServer">点击前往管理页面</el-button>
    <div class="header">
    </div>
    <div class="wheel-container">
      <div class="pointer" @click="beginRotate"></div>
      <div class="wheel" :style="rotateStyle">
        <div class="prize-list">
          <div class="prize-item"
               v-for="(item,index) in prizeList"
               :key="index"
               :style="item.style">
            <div class="prize-img" style="width: 70%;height: 40%">
              <el-image fit="contain" :src="item.prizeImg" alt="图片不见了" style="width: 100%;height: 100%"></el-image>
            </div>
            <div class="prize-name">
              <span >{{item.prizeName}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <table>
        <tr>
          <th>奖品名</th>
          <th>中奖率</th>
          <th>剩余数量</th>
        </tr>
        <tr v-for="(item,index) in tableList" :key="index">
          <td>{{item.prizeName}}</td>
          <td>{{item.rate}}%</td>
          <td>{{item.num}}</td>
        </tr>
      </table>
    </div>
    <div class="prizeDisplay" v-if="open">
      <div style="text-align: center">
        <span>恭喜抽中了{{prize.prizeName}}</span>
      </div>
      <img :src="prize.prizeImg" style="object-fit: cover;width: 80%;height: 80%">
      <div>
        <el-button size="mini" @click="prizeConfirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      open: false,
      userType: null,
      prizeList: [],
      prizeAngleList: [],
      tableList: [],
      rotateAngle: 0,
      index: 0,
      prize: {},
      isRotating: false,
      config: {
        duration: 5000,
        circle: 8,
        mode: 'ease-in-out'
      }
    }
  },
  computed: {
    rotateStyle () {
      return `
        -webkit-transition: transform ${this.config.duration}ms ${this.config.mode};
        transition: transform ${this.config.duration}ms ${this.config.mode};
        -webkit-transform: rotate(${this.rotateAngle}deg);
            transform: rotate(${this.rotateAngle}deg);`
    }
  },
  mounted() {
    this.user.nowUser = this.$cookies.get('username')
    this.userType = this.$cookies.get('userType')
    console.log(this.userType)
    if (this.user.nowUser === null) {
      this.$router.push({path:'/Login'})
      this.$message({
        type: "info",
        message: '请登录'
      })
    }
    this.getPrizeList()
    // console.log("prizeList")
    // console.log(this.prizeList)
  },
  methods: {
    prizeConfirm() {
      this.open = false
      this.config.duration = 5000
      this.getPrizeList()
      this.isRotating = false
    },
    getPrizeList() {
      fetch('https://qc5plm.fn.thelarkcloud.com/getPrizeList').then(response => {
        return response.json()
      }).then(myJson => {
        this.initialAngel(myJson.ids)
        this.tableList = myJson.ids
      })
    },
    initialAngel(list) {
      const average = 60
      const half = average / 2
      // 添加每个奖项的旋转显示角度
      console.log(list)
      this.prizeAngleList = []
      this.prizeList = []
      for(let i = 0;i < 6;i++) {
        let item = list[i]
        let angle = -(i * average + half)
        this.prizeAngleList.push((i * average) + half)
        item.style = `-webkit-transform: rotate(${angle}deg);
                      transform: rotate(${angle}deg);`
        this.prizeList.push(item)
      }
    },
    beginRotate() {
      // 点击开始抽奖
      const {isRotating,config,rotateAngle,prizeAngleList} = this
      // 0-5 奖项index
      if (isRotating) return
      this.isRotating = true
      fetch('https://qc5plm.fn.thelarkcloud.com/getPrize').then(response => {
        return response.json()
      }).then(myJson => {
        this.index = myJson.prizeIndex
        let angle = rotateAngle + config.circle * 360 + prizeAngleList[this.index]
                    - (rotateAngle % 360)
        this.rotateAngle = angle
        console.log(this.index)
        this.prize = this.prizeList[this.index]
      })
      //旋转结束
      setTimeout(() => {
        this.rotateOver()
      },config.duration + 1000)
    },
    // getRandomIndex() {
    //   let number = parseInt(Math.random() * 100)
    //   let i = 0;
    //   let rateNumber = this.prizeList[i].rate
    //   console.log(number)
    //   for (i = 0; i< 6;i++) {
    //     rateNumber = rateNumber + this.prizeList[i].rate
    //     if (number < rateNumber) {
    //       return i
    //     }
    //   }
    //   return i
    // },
    rotateOver() {
      this.open = true
      this.config.duration = 0
      this.rotateAngle = 0
    },
    gotoServer() {
      this.$router.push({path:'/server'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media screen and (max-width: 500px){
  .wheel-container{
    margin: 0 auto;
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: 50%;
  }
  td {
    text-align: center;
    width: 4rem;
  }
  th {
    text-align: center;
    width: 4rem;
  }
}
@media screen and (min-width: 501px){
  .wheel-container{
    margin: 0 auto;
    position: relative;
    width: 50%;
    padding-top: 50%;
    border-radius: 50%;
  }
  td {
    text-align: center;
    width: 5rem;
  }
  th {
    text-align: center;
    width: 5rem;
  }
}
.hello {
  width: 100%;
  background: url("https://p1.xywm.ltd/2021/07/20/eb999c2b5bd7d.png");
  min-height: 100%;
  background-size: cover;
}
.header {
  width: 100%;
  padding-top: 40%;
  background: url("https://p1.xywm.ltd/2021/07/20/e6cd3e92d321a.png");
  background-size: cover;
}
.wheel {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: url("https://p1.xywm.ltd/2021/07/20/d580ff5489002.png") no-repeat center top;
  background-size: cover;
  color: #fff;
}
.pointer {
  position: absolute;
  top: 47%;
  left: 50%;
  z-index: 2;
  width: 16%;
  height: 26%;
  background: url("https://p1.xywm.ltd/2021/07/20/fe8d834dadf8c.png") no-repeat center top;
  background-size: cover;
  transform: translate3d(-50%, -50%, 0);
}
.prize-list {
  width: 100%;
  height: 100%;
  position: relative;
}
.prize-list .prize-item {
  position: absolute;
  width: 25%;
  height: 50%;
  top: 0;
  left: 50%;
  margin-left: -12.5%;
  transform-origin: 50% 100%;
  color: #B0C4DE;
}
.prize-img {
  position: relative;
  margin: 0 auto;
  top: 20%;
}
.prize-name {
  position: relative;
  margin: 0 auto;
  top: 20%
}
.prizeDisplay {
  position: absolute;
  width: 60%;
  height: 60%;
  left: 18%;
  top: 20%;
  padding: 2%;
  background-color: #B0C4DE;
  border-radius: 5px;
  z-index: 100;
}
table {
  border: 1px;
  color: #B0C4DE;
  margin-top: 20px;
  margin-right: auto;
  margin-left: auto;
}
</style>
