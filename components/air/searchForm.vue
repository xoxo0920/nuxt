<template>
    <div class="search-form">
        <!-- 头部tab切换 -->
        <el-row type="flex" class="search-tab">
            <span v-for="(item,index) in tabs" :key="index"
            @click="handleSearchTab(index)"
            :class="{active:index === currentTab}">
            <i :class="item.icon"></i>{{item.name}}
            </span>
        </el-row>

        <el-form class="search-form-content" 
        ref="form" 
        label-width="80px">
            <!-- fetch-suggestions:每次输入的时候都会触发，设置下拉菜单的数据 -->
            <!-- select:选中下拉菜单的值得是触发  -->
            <el-form-item label="出发城市">
                <el-autocomplete
                :fetch-suggestions="queryDepartSearch" 
                placeholder="请搜索出发城市" 
                @select="handleDepartSearch"
                class="el-autocomplete"
                v-model="form.departCity">
                </el-autocomplete>
            </el-form-item>

            <el-form-item label="到达城市">
                <el-autocomplete
                :fetch-suggestions="queryDestSearch" 
                placeholder="请搜索到达城市" 
                @select="handleDestSearch"
                class="el-autocomplete"
                v-model="form.destCity">
                </el-autocomplete>
            </el-form-item>
            <!--type：声明选中器是日期的选择器  -->
            <!--  change：选中日期时候触发的事件-->
            <el-form-item label="出发时间">
                <el-date-picker 
                type="date"
                placeholder="请选择日期"
                style="width:100%"
                @change="handleDate"
                v-model="form.departDate">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="">
                <el-button 
                style="width:100%"
                type="primary" 
                icon="el-icon-search"
                @click="handleSubmit">搜索</el-button>
            </el-form-item>

            <div class="reverse">
                <span @click="handleReverse">换</span>
            </div>
        </el-form>
    </div>
</template>

<script>
// 导入momentjs
import moment from "moment";
export default {
    data(){
        return{
            form:{
                departCity: "", // 出发城市
                departCode: "", // 出发城市代码
                destCity: "",  // 到达城市
                destCode: "",  // 到达城市代码
                departDate: "", // 日期字符串
            },
            tabs:[
                 {icon: "iconfont icondancheng", name: "单程"},
                {icon: "iconfont iconshuangxiang", name: "往返"}
            ],
            currentTab:0
        }
    },
    methods:{
        //tab栏切换时触发
        handleSearchTab(index){},
        //出发城市输入框获得焦点时触发
        //value是选中的 值，cb是回调函数，接收要显示的列表
        queryDepartSearch(value,cb){
            if(!value){
                return
            }
            this.$axios({
                url:"/airs/city?name="+value,
                // url: "http://157.122.54.189:9095/airs/city?name=" + value,
                method:"GET"
            }).then(res=>{
                console.log(res.data);
                const {data} = res.data;
                const newData = data.map(v=>{
                    return{
                        ...v,
                        value:v.name.replace("市","")
                    }
                })
                //cb函数接收的参数是数组，数据里面每一项必须是对象，带有value属性
                cb(newData)
            })
        },
        //目标城市输入框获取焦点时触发
        //value是选中的 值，cb是回调函数，接收要显示的列表
        queryDestSearch(value,cb){
            if(!value){
                return
            }
            this.$axios({
                // url:"/airs/city?name="+value,
                url: "http://157.122.54.189:9095/airs/city?name=" + value,
                method:"GET"
            }).then(res=>{
                console.log(res.data);
                const {data} = res.data;
                const newData = data.map(v=>{
                    return{
                        ...v,
                        value:v.name.replace("市","")
                    }
                })
                //cb函数接收的参数是数组，数据里面每一项必须是对象，带有value属性
                cb(newData)
            })
        },
        //出发城市下拉时触发
        handleDepartSearch(item){
            this.form.departCity = item.value;
            this.form.departCode = item.sort;
        },
        //到达城市下拉时触发
        handleDestSearch(item){
            this.form.departCity = item.value;
            this.form.departCode = item.sort;
        },
        //确认日期后触发
        handleDate(){

        },
        //触发和目标城市切换时触发
        handleReverse(){
            this.form.departDate = moment(value).format(`YYYY-MM-DD`)
        },
        // 提交表单时触发
        handleSubmit(){
            //自定义规则
            const rules = {
                //出发城市的数据
                depart:{
                    value:this.form.departCity,
                    message: "请输入出发城市"
                    },
                    // 到达城市的数据
                    dest:{
                        value:this.form.destCity,
                        message:"请输入到达城市"
                    },
                    departDate:{
                        value:this.form.departDate,
                        message:"请输入出发日期"
                    }
            };
            // /验证的开关，如果是false代表不通过
            let valid = true;
            //循环验证表单的数据
            Object.keys(rules).forEach(v=>{
                if(!valid) return;
                if(!rules[v].value){
                    // console.log(this.$message.warning);
                    this.$message.warning(rules[v].message);
                    valid = false;
                }
            })
            if(!valid) return;
            //跳转到列表页
            this.$router.push({
                path:"/air/flights",
                query:this.form
            })
        }
         
    }
}
</script>

<style scoped lang="less">
    search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}
</style>
