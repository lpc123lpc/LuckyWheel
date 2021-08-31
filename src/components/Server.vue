<template>
 <div class="server_container" style="padding: 10px;margin: 0 auto">
   <el-tabs  v-model="activeName" type="card">
     <el-tab-pane label="轮盘奖项管理" name="first">
       <div style="text-align: center">
         <el-button @click="gotoWheel" size="mini">前往抽奖</el-button>
         <el-button type="primary" plain @click="setWheel" size="mini" style="margin-left: 20%">设置转盘奖项</el-button>
       </div>
       <el-table :data="selectedPrizeList">
         <el-table-column label="名称" prop="prizeName"/>
         <el-table-column label="中奖率" prop="rate" :formatter="rateFormatter"/>
         <el-table-column label="图片">
           <template  slot-scope="scope">
             <el-image
                 style="width: 5rem;height: 5rem"
                 :src="scope.row.prizeImg"
                 fit="fit" ></el-image>
           </template>
         </el-table-column>

       </el-table>
     </el-tab-pane>
     <el-tab-pane label="奖项库管理管理" name="second">
       <div style="text-align: left">
         <el-input style="width: 25%" v-model="searchName" placeholder="请输入名称" size="mini"/>
         <el-button size="mini" @click="search" style="margin-left: 10px">搜索</el-button>
         <el-button size="mini" @click="reset">重置</el-button>
         <el-button type="primary" plain @click="addPrize" size="mini">新增奖项</el-button>
       </div>
       <el-table :data="allPrizeList">
         <el-table-column label="名称" prop="prizeName"/>
         <el-table-column label="库存" prop="num"/>
         <el-table-column label="图片">
           <template   slot-scope="scope">
             <el-image
                 style="width: 5rem;height: 5rem"
                 :src="scope.row.prizeImg"
                 fit="fit" ></el-image>
           </template>
         </el-table-column>
         <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
           <template slot-scope="scope">
             <el-button
                 size="mini"
                 type="text"
                 icon="el-icon-plus"
                 @click="addNum(scope.row)">
               增加库存
             </el-button>
             <el-button
                 size="mini"
                 type="text"
                 icon="el-icon-edit"
                 @click="updatePrize(scope.row,scope.$index)"
             >修改</el-button>
             <el-button
                 size="mini"
                 type="text"
                 icon="el-icon-delete"
                 @click="deletePrize(scope.row,scope.$index)"
             >删除</el-button>
           </template>
         </el-table-column>
       </el-table>
     </el-tab-pane>
   </el-tabs>

   <el-dialog title="添加库存" :visible.sync="isAddNumFormOpen" width="300px">
     <el-input type="number" v-model="addNumForm.num"/>
     <el-button @click="handleAddNum">确定</el-button>
   </el-dialog>

<!--   修改库中奖项数据-->
   <el-dialog :title= title :visible.sync="isFormOpen" width="70%" append-to-body>
     <el-form :model="form">
       <el-form-item label="奖品名称">
         <el-input v-model="form.prizeName"></el-input>
       </el-form-item>
       <el-form-item label="奖品图片">
         <el-upload
             v-model="fileList"
            :file-list="fileList"
            action="nothing"
            :http-request="uploadImg"
            list-type="picture"
            accept="image/*">
          <el-button size="small" type="primary" icon="el-icon-upload">点击上传</el-button>
        </el-upload>
       </el-form-item>
     </el-form>
     <div style="text-align: center">
       <el-button type="primary" plain @click="handleForm">确定</el-button>
       <el-button type="info" style="margin-left: 30%" plain @click="closeForm">取消</el-button>
     </div>
   </el-dialog>

<!--修改轮盘奖项数据-->
   <el-dialog title="设置轮盘奖项" :visible.sync="setWheelPrizes" width="80%" append-to-body>
     <el-checkbox-group
         v-model="selectedPrizes"
         :min="0"
         :max="6">
       <el-checkbox v-for="item in allPrizeList" :label="item._id" :key="item._id" style="width: 100%;padding: 10px">{{item.prizeName}}
       </el-checkbox>
     </el-checkbox-group>
     <div style="text-align: center">
       <el-button type="primary" plain @click="setRate">下一步</el-button>
     </div>

     <el-dialog title="设置奖项概率" :visible.sync="setRateOpen" width="80%" append-to-body >
       <el-form ref="rateForm" :model="rateForm" label-width="30%" label-position="right" :rules="rules">
         <el-form-item :label="idToNameMap[selectedPrizes[0]]" prop="rate1">
           <el-input type="number" v-model="rateForm.rate1">
             <template slot="append">%</template>
           </el-input>
         </el-form-item>
         <el-form-item :label="idToNameMap[selectedPrizes[1]]" prop="rate2">
           <el-input type="number" v-model="rateForm.rate2">
             <template slot="append">%</template>
           </el-input>
         </el-form-item>
         <el-form-item :label="idToNameMap[selectedPrizes[2]]" prop="rate3">
           <el-input type="number" v-model="rateForm.rate3">
             <template slot="append">%</template>
           </el-input>
         </el-form-item>
         <el-form-item :label="idToNameMap[selectedPrizes[3]]" prop="rate4">
           <el-input type="number" v-model="rateForm.rate4">
             <template slot="append">%</template>
           </el-input>
         </el-form-item>
         <el-form-item :label="idToNameMap[selectedPrizes[4]]" prop="rate5">
           <el-input type="number" v-model="rateForm.rate5">
             <template slot="append">%</template>
           </el-input>
         </el-form-item>
         <el-form-item :label="idToNameMap[selectedPrizes[5]]" prop="rate6">
           <el-input type="number" v-model="rateForm.rate6">
             <template slot="append">%</template>
           </el-input>
         </el-form-item>
       </el-form>
       <div style="text-align: center">
         <el-button type="primary" plain @click="handleSelectedPrizes">确定</el-button>
         <el-button type="info" plain @click="setRateOpen= false" style="margin-left: 30%">取消</el-button>
       </div>
     </el-dialog>
   </el-dialog>

 </div>
</template>

<script>
const InspireCloud = require('@byteinspire/js-sdk')
const serviceId = 'qc5plm'; // 替换成你的 serviceId，可在后台「设置」页面获取
const fileUploadToken = '0a44c895-f536-459c-bfad-06b5e6596d1f'; // 替换成你的客户端上传 token，可在后台「设置」页面获取

const inspirecloud = new InspireCloud({ serviceId });

export default {
  name: "Server",
  data () {
    return {
      //添加的库存
      addNumForm: {
        prizeId: null,
        num: null
      },
      //是否增加库存
      isAddNumFormOpen: false,
      // /搜索框中name
      searchName: null,
      // id to name
      idToNameMap: {},
      //奖品概率form
      rateForm: {
        rate1: null,
        rate2: null,
        rate3: null,
        rate4: null,
        rate5: null,
        rate6: null,
      },
      //是否打开设置奖品概率
      setRateOpen: false,
      //选中的奖项
      selectedPrizes: [],
      //控制设置轮盘奖项打开
      setWheelPrizes: false,
      // 默认展示tab页
      activeName: 'first',
      //所有奖项列表
      allPrizeList: [],
      //修改或添加对话框标题
      title: '添加',
      // 对话框是否打开
      isFormOpen: false,
      // 是否是添加
      isAdd : false,
      // 六个选中奖项
      selectedPrizeList: [],
      // 对话框内容
      form: {
        _id: null,
        prizeName: null,
        prizeImg: null,
      },
      // 添加数量对话框
      numForm: {
        _id: null,
        prizeAddNum: null,
      },
      // 上传的图片文件
      fileList: [],
      rules : {
        rate1: [
          {required: true, message: '请输入概率', trigger: 'blur' },
          {pattern: /^[0-9]{1,2}$/ ,message: '请输入一到两位整数'}
        ],
        rate2: [
          {required: true, message: '请输入概率', trigger: 'blur' },
          {pattern: /^[0-9]{1,2}$/ ,message: '请输入一到两位整数'}
        ],
        rate3: [
          {required: true, message: '请输入概率', trigger: 'blur' },
          {pattern: /^[0-9]{1,2}$/ ,message: '请输入一到两位整数'}
        ],
        rate4: [
          {required: true, message: '请输入概率', trigger: 'blur' },
          {pattern: /^[0-9]{1,2}$/ ,message: '请输入一到两位整数'}
        ],
        rate5: [
          {required: true, message: '请输入概率', trigger: 'blur' },
          {pattern: /^[0-9]{1,2}$/ ,message: '请输入一到两位整数'}
        ],
        rate6: [
          {required: true, message: '请输入概率', trigger: 'blur' },
          {pattern: /^[0-9]{1,2}$/ ,message: '请输入一到两位整数'}
        ]
      }
    }
  },
  mounted() {
    this.user.nowUser = this.$cookies.get('username')
    this.user.noewUserType = this.$cookies.get('userType')
    if (this.user.nowUser === null || this.user.nowUserType === '0') {
      this.$router.push({path:'/Login'})
      this.$message({
        type: "info",
        message: '请登录'
      })
    }
    this.getAll()
  },

  methods: {
    //向后台提交库存
    handleAddNum() {
      console.log(this.addNumForm)
      fetch('https://qc5plm.fn.thelarkcloud.com/addPrizeNnum', {
        method: 'POST',
        body: JSON.stringify(this.addNumForm),
        headers: new Headers({
          'Content-Type': 'application/json',
        })
      }).then(() => {
        this.isAddNumFormOpen = false
        this.$message('添加库存成功')
        this.getAll()
      })
    },
    // 添加库存
    addNum(row) {
      console.log(row)
      this.addNumForm.prizeId = row._id
      this.isAddNumFormOpen = true
    },
    reset() {
      this.searchName = null
      this.getAll()
    },
    search() {
      if (this.searchName === null || this.searchName === '') {
        this.getAll()
      }
      else {
        fetch('https://qc5plm.fn.thelarkcloud.com/search', {
          method: 'POST',
          body: JSON.stringify({
            prizeName: this.searchName
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
          })
        }).then(response => {
          console.log(response)
          response.json().then(data => {
            this.allPrizeList = data.searchItems
          })
        })
      }
    },
    rateFormatter(row, column, cellValue) {
      return cellValue + '%'
    },
    handleSelectedPrizes() {
      this.$refs.rateForm.validate( valid => {
        if (valid) {
          let setWheelPrizes = []
          let totalRate = 0
          for (let i = 0; i< 6;i++) {
            let key = "rate" + (i+1)
            totalRate += parseInt(this.rateForm[key])
            setWheelPrizes.push({
              "prizeId": this.selectedPrizes[i],
              "rate": parseInt(this.rateForm[key])
            })
          }
          if (totalRate !== 100) {
            this.$message('请确保中奖概率之和为1');
          }
          else {
            // console.log(totalRate)
            console.log(setWheelPrizes)
            fetch('https://qc5plm.fn.thelarkcloud.com/setPrizes', {method: 'POST',
              body: JSON.stringify({
                items: setWheelPrizes
              }),
              headers: new Headers({
                'Content-Type': 'application/json',
              })
            }).then(function (response) {
              response.json().then((data) => {
                console.log(data)
              })
            }).then(() => {
              this.getSelected()
              this.setRateOpen = false
              this.setWheelPrizes = false
            }).catch(function (err) {
              alert(err.toString())
            })
          }
        }
      })

    },
    // 点击下一步设置中奖率
    setRate() {
      if (this.selectedPrizes.length < 6) {
        this.$message('必须选择六个奖品');
      }
      else {
        this.setRateOpen = true
        this.rateForm = {}
        this.allPrizeList.forEach(item => {
          let key = item._id
          this.idToNameMap[key] = item.prizeName
        })
      }
    },
    // 设置轮盘奖项内容
    setWheel() {
      this.setWheelPrizes = true
      this.selectedPrizes = []
    },
    // 获取轮盘奖项
    getSelected() {
      let that = this
      fetch('https://qc5plm.fn.thelarkcloud.com/getPrizeList').then(response => {
        return response.json()
      }).then(myJson => {
        that.selectedPrizeList = myJson.ids
      })
    },
    //获取所有奖项
    getAll(){
      let that = this
      this.searchName = null
      this.getSelected()
      fetch('https://qc5plm.fn.thelarkcloud.com/getAllPrizes').then(response => {
        return response.json()
      }).then(myJson => {
        that.allPrizeList = myJson.items
        // console.log(myJson.items)
      })
    },
    //上传图片
    uploadImg(val) {
      const that = this
      inspirecloud.file.upload('img',val.file,{token: fileUploadToken})
        .then(data => {
          // console.log(data.url)
          that.form.prizeImg = data.url
        }).catch(error => {
          console.log(error)
      })
    },
    addPrize() {
      this.isFormOpen = true
      this.title = '添加'
      this.isAdd = true
      this.form = {}
      this.fileList = []
    },
    closeForm() {
      this.isFormOpen = false
    },
    handleForm() {
      this.isFormOpen = false
      if (this.form.prizeName === null) {
        this.$message({
          type:'warning',
          message: '请输入奖品名称'
        })
        return
      }
      else if (this.form.prizeImg === null) {
        this.$message({
          type: "warning",
          message: '请上传图片'
        })
        return
      }
      if (this.isAdd === true) {
        fetch('https://qc5plm.fn.thelarkcloud.com/addPrize', {method: 'POST',
          body: JSON.stringify({
            'prizeName': this.form.prizeName,
            'prizeImg': this.form.prizeImg
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
          })
        }).then((response) => {
          response.json().then((data) => {
            console.log(data)
            if(data.code === 0) {
              this.$message({
                type:'warning',
                message: '不允许添加同名奖品'
              })
            }
            else {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
            }
          })
        }).then(() => {
          this.getAll()
        }).catch(function (err) {
          alert(err.toString())
        })
      }
      else {
        fetch('https://qc5plm.fn.thelarkcloud.com/updatePrize', {method: 'POST',
          body: JSON.stringify({
            'id': this.form._id,
            'prizeName': this.form.prizeName,
            'prizeImg': this.form.prizeImg
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
          })
        }).then( (response) => {
          response.json().then((data) => {
            console.log(data)
            if (data.code === 1) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
            }
            else if (data.code === 2) {
              this.$message({
                type:'warning',
                message: '已存在该名称奖项，请更改名称'
              })
            }
          })
        }).then(() => {
          this.getAll()
        }).catch(function (err) {
          alert(err.toString())
        })
      }
    },
    gotoWheel() {
      this.$router.push({path: '/luckyWheel'})
    },
    updatePrize(row,index) {
      this.isAdd = false;
      this.isFormOpen = true;
      this.title = '修改'
      this.fileList = []
      this.form = {...row}
      console.log(index)
    },
    deletePrize(row) {
      this.$confirm('此操作将永久删除该奖项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetch('https://qc5plm.fn.thelarkcloud.com/deletePrize',{method: 'POST',
          body: JSON.stringify({
            'id': row._id
          }),
          headers: new Headers({
            'Content-Type': 'application/json',
          })
        }).then(response => {
          response.json().then(data => {
            console.log(data)
            if (data.code=== 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
            else if (data.code === 2) {
              this.$message({
                type: 'warning',
                message: '无法删除设置在轮盘中的奖品，请将其从轮盘中移除!'
              });
            }
            else {
              this.$message({
                type: 'error',
                message: '后端已无该奖品记录!'
              });
            }
          })
        }).then(() => {
          this.getAll()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>

<style>
.el-message-box {
  width: 350px;
}
.el-tabs{
  border: 1px solid #E4E7ED;
  box-shadow:2px 2px 2px 1px #ebeef5, -2px -2px 2px 1px #ebeef5;
}
@media screen and (max-width: 500px){
  .server_container {
    width: 95%;
  }
}
@media screen and (min-width: 501px){
  .server_container {
    width: 80%;
  }
}
</style>
