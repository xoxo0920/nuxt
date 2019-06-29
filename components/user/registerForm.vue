<template>
    <el-form class="form" :rules="rules" ref="form" :model="form">
        <!-- 手机号码 -->
        <el-form-item prop="username">
            <el-input placeholder="用户名手机" v-model="form.username"></el-input>
        </el-form-item>
        <!-- 验证码 -->
        <el-form-item prop="captcha" class="form-item">
            <el-input placeholder="验证码" 
            v-model="form.captcha" >
                <template slot="append">
                        <el-button @click="handleSendCaptcha">
                            发送验证码
                        </el-button>
                </template>
            </el-input>
        </el-form-item>
        <!-- 名字 -->
        <el-form-item prop="nickname" class="form-item">
            <el-input placeholder="你的名字" 
            v-model="form.nickname" ></el-input>
        </el-form-item>
            <!-- 密码 -->
        <el-form-item prop="password">
            <el-input placeholder="密码" type="password"
            v-model="form.password" ></el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="checkPassword">
            <el-input placeholder="确认密码" type="password"
            v-model="form.checkPassword" ></el-input>
        </el-form-item>

        <el-button class="submit" @click="handleSubmit">注册</el-button>
    </el-form>
</template>

<script>
export default {
    data(){
        //rule:当前规则的对象
        // value：当前调用规则的字段值
        // callback：是回调函数代表执行下一步，必须要调用
        const validatePass = (rule,value,callback)=>{
            if(value === ""){
                callback(new Error("请再次输入密码..."))
            }else if(value !== this.form.password){
                callback (new Error("两次输入的密码不一致"))
            }else{
                callback()
            }
        }
        return{
            //表单规则
            rules:{
                username:[{required: true, message: '请输入用户名', trigger: 'blur' }],
                password:[{required: true, message: '请输入密码', trigger: 'blur' }],
                //自定义验证规则，validator自定义验证的函数
                checkPassword:[{validator: validatePass, trigger: 'blur'}],
                nickname:[{required: true, message: '请输入昵称', trigger: 'blur' }],
                captcha:[{required: true, message: '请输入验证码', trigger: 'blur' }]
            },
            //表单数据
            form:{
                username: "",   // 登录用户名/手机
                password: ""   , // 登录密码
                checkPassword: "", // 确认密码
                nickname: "",	// 昵称
                captcha: ""		// 手机验证码
            }
        }
    },
    methods:{
        handleSendCaptcha(){
            if(this.form.username == ""){
                console.log(this.form.username);
                this.$confirm("手机号码不能为空","提示",{
                    confirmButtonText:"确定",
                    showCancelButton:false,
                    type:"warning"
                })
                return;
            }
            //请求验证码
            this.$axios({
                url:"/captchas",
                method:"POST",
                data:{
                    tel:this.form.username
                }
            }).then(res =>{
                // console.log(res.data);
                const {code} = res.data;
                alert("验证码是："+code)
            })
        },
        //注册接口
        handleSubmit(){
            //调用注册的接口
            this.$refs.form.validate(valid =>{
                if(valid){
                    const {checkPassword, ...props} = this.form
                    this.$axios({
                        url:"/accounts/register",
                        method:"POST",
                        data:props
                    }).then(res=>{
                        console.log(res.data);
                        //把用户数据设置给store
                        this.$store.commit("user/setUserInfo",res.data);

                        this.$message.success("注册成功，正在跳转");
                        
                        setTimeout(()=>{
                            this.$router.push("/")
                        },1000)
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
     .form{
        padding:25px;
    }

    .form-item{
        margin-bottom:20px;
    }

    .form-text{
        font-size:12px;
        color:#409EFF;
        text-align: right;
        line-height: 1;
    }

    .submit{
        width:100%;
        margin-top:10px;
        background: cyan;
    }
</style>
