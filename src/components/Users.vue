<template>
<div class="users">
  <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 搜索栏 -->

  <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input>
  <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
  <!-- 表格组件 -->
  <!--
    el-table：表格组件
    data：指定表格最终需要渲染的数据（数组）
    style：让表格宽度100%
    el-table-column：定义表格的每一列
    lable=“日期”：列的标题
    prop：对应显示的数据的属性名
    width：列的宽高，不支持百分比

    在el-table中,如果想要自定义列模版
    在el-table-column中使用template

     <template slot-scope="scope">自己定义的内容</template>

   -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <!-- 在自定义模版中,如何访问到当前列的数据 -->
         <template slot-scope="scope">
          <el-switch @change="changeState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
         <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="showEditDialog(scope.row)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="delUser(scope.row.id)"
            plain
            size="mini"
          ></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  <!--
      分页
      @size-change: 表示每页的条数发生了改变，会触发handleSizeChange
      @current-change: 当前页发生改变
      current-page: 指定当前页面
      page-sizes: 指定选择每页条数的数组
      page-size: 每页的条数
      total:指定总条数
      layout: 指定分页的空间


      </el-pagination>
      1. size-change: 修改了每页的条数
      2. current-change： 修改了页码
      3. 指定  pageSize  currentPage  total: 获取用户列表的时候
      4. page-sizes: 每页的条数   pageSize
      5.  layout： 控制分页控制的显示的顺序
    -->

   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
      >
    </el-pagination>


   <!--
     添加信息提示框
     visible:对话框后是否可见

     -->
  <el-dialog title="添加信息" :visible.sync="addDialogVisible" width="50%" >
    <!-- 添加表单 -->
    <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules" status-icon>
      <el-form-item label="姓名" prop="username">
        <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
       <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
       <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
       <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
    </el-dialog>

    <!-- 修改信息框 -->
     <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="50%" >
    <!-- 修改表单 -->
    <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules" status-icon>
      <el-form-item label="用户名">
       <el-tag type ="info">{{editForm.username}}</el-tag>
      </el-form-item>
       <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
       <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="updateUser">确 定</el-button>
    </span>
    </el-dialog>
</div>

</template>

<script>
// 引入axios
// import axios from 'axios'
export default {
  data() {
    return {
      // 用户列表
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total:0,
      addDialogVisible: false,
      addForm:{
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
       rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'change' },
            { min: 3, max: 9, message: '长度在 3 到 9个字符', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入正确密码格式', trigger: 'change' },
            { min: 6, max: 12, message: '长度在6 到 12 个字符', trigger: 'change' }
          ],
          email: [
            { type: 'email', message: '请输入一个合法的邮箱', trigger: 'change' },

          ],
           mobile: [
            {  pattern: /^1\d{10}$/, message: '请输入合法的手机号码', trigger: 'change' },

          ],
       },
      editDialogVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
methods: {


  async getUserList(){
    // axios如果是get/delete请求,参数要么直接拼接地址栏,要么放到params中
    // 如果post请求,参数放到data中

    // 除了login请求,其他所有的接口都必须携带token,要求设置给请求头:Authorization
   let res = await this.axios({
      method: 'get',
      url: 'users',
      params: {
        query: this.query,
        pagenum: this.currentPage,
        pagesize: this.pageSize
      },

    })
    let {meta:{status},data:{users,total}} = res
    if(status === 200){
      this.userList = users
      this.total = total

    }


  },
    handleSizeChange(val) {
      //  修改this.pageSize
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      //  把currentPage修改成val
      this.currentPage = val
      this.getUserList()
    },
    search(){
        // 搜索的时候把当前页改成1
        this.currentPage = 1
        this.getUserList()
    },
    async delUser(id){
     try{
        await this.$confirm('你确定要删除吗','温馨提示',{
        type:'warning'

      })
        // 发送ajax请求
     await this.axios({
        method:'delete',
        url:`users/${id}`,
      })

      if(res.meta.status === 200){
        //  如果成功了,并且我们发现当前页只有一条数据了，应该current减1，渲染上一页
        if(this.userList.length <= 1 && this.currentPage >1){
          this.currentPage--
        }
        this.getUserList()
        this.$message
         .success('恭喜你,删除成功!');
      }

     }catch(e){
        this.$message.info('取消删除了')
     }






    },
   async changeState({id,mg_state}){
        // console.log(user);
    let res = await this.axios({
      method:'put',
      url:`users/${id}/state/${mg_state}`,
      //  headers: {
      //       Authorization: localStorage.getItem('token')
      //   }
    })
      //  console.log(res);
      if(res.meta.status === 200){
        this.$message.success('状态修改成功')
      }else{
          this.$message.error('状态修改失败')
      }
  },
    // 显示对话框
    showAddDialog(){
      this.addDialogVisible = true

    },
    addUser(){
      // 校验整个表单
      this.$refs.addForm.validate(async valid=>{
        // valid如果为true,就表示通过,否则不通过
        if(!valid) return false
          // 发送ajax请求,进行登录
        let res = await this.axios({
            method:'post',
            url:'users',
            data:this.addForm
          })
        let {meta:{status,msg}} = res
        if(status === 201){
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          // 重新渲染页面
          this.getUserList()
          // 重置表单样式
            this.$refs.addForm.resetFields()
          //  隐藏模态框
            this.addDialogVisible = false
          // 添加成功提示信息
          this.$message.success('添加成功')
        }else{
          this.$message.error(msg)
        }

      })

    },

    showEditDialog(row) {
      // 显示对话框
      this.editDialogVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    updateUser(){
      // 表单校验
      this.$refs.editForm.validate(async valid=>{
        if(!valid) return false
      let res = await this.axios({
          method:'put',
          url:`users/${this.editForm.id}`,
          data:this.editForm
        })
          let {meta:{status}} = res
          if(status === 200){
            // 重新渲染
            this.getUserList()
            // 隐藏修改对话框
            this.editDialogVisible = false
            // 重置修改表单
            this.$refs.editForm.resetFields()
            // 提示信息
            this.$message.success('恭喜你,修改成功')

          } else {
            this.$message.error('服务器异常')

          }
        })
     
    }
  },

    created() {
      this.getUserList()

    }
}
</script>

<style lang="less" scoped>
.el-breadcrumb{
   height: 50px;
  line-height: 50px;
}
.input-with-select{
  width: 200px;

}

</style>
