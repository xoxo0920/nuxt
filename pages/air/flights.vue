<template>
    <section class="contianer">
        <el-row type="flex" justify="space-between">
            <!-- 顶部过滤列表 -->
            <div class="flights-content"> 
                <!-- 过滤条件 -->
                <flightsFilters :data="flightsData"/>
                <!-- 航班头部布局 -->
                 <fightsListHead/> 
                <!-- 航班信息 -->
                <div>
                    <flightsItem 
                    v-for="(item,index) in dataList" 
                    :key="index" 
                    :data="item"/>
                    <!-- 分页 -->
                    <el-row type="flex" justify="space-between" style="margin-top:10px">
                        <!--size-change:切换条数时触发  -->
                        <!-- current-change：选择页数时触发 -->
                        <!-- current-page：当前页 -->
                        <!-- page-size：当前条数 -->
                        <!-- total：总条数 -->
                        <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-sizes="[5,10,15,20]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="flightsData.total">
                        </el-pagination>
                    </el-row>
                </div>
            </div>
            <!-- 侧边栏组件 -->
            <div class="aside"></div>
        </el-row>
    </section>
</template>

<script>
import moment from "moment";
import fightsListHead from "@/components/air/fightsListHead"
import flightsItem from "@/components/air/flightsItem"
import flightsFilters from "@/components/air/flightsFilters"
export default {
    components:{
        fightsListHead,
        flightsItem,
        flightsFilters
    },
    data(){
        return{
            flightsData:{
                //默认机票数据
                info:{},
                options:{},
                flights:[]
            },//航班总数据
            dataList:[],//航班列表数据，用于循环flightsItem组件
            pageIndex:1,//当前页数
            pageSize:5,  //显示条数
            total:0,
        }
    },
    mounted(){
        this.$axios({
            url:"/airs",
            params:this.$route.query //url的参数
        }).then(res=>{
            console.log(res.data);
            this.flightsData = res.data;
            this.dataList = this.flightsData.flights;
            //获取1到5条数据
            this.dataList = res.data.flights.slice(0,5);
            //总条数
            this.total = res.data.total;

        })
    },
    methods:{
        // 分页切换条数触发
        handleSizeChange(value){
            console.log(value);
            this.pageSize = value;
        },
        // 页数切换时候触发
        handleCurrentChange(value){
            this.pageIndex = value;

            //计算切换列表的数据
            this.dataList = this.flightsData.flights.slice(
                (this.pageIndex - 1) * this.pageSize,
                this.pageIndex * this.pageSize
            )
        }
    }
}
</script>

<style scoped lang="less">
      .contianer{
        width:1000px;
        margin:20px auto;
    }

    .flights-content{
        width:745px;
        font-size:14px;
    }

    .aside{
        width:240px;
    } 
</style>
