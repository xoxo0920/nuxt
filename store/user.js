import { resolve } from "q";

//用户管理
//store中的state不能修改的类似于vue组件的data，用于声明仓库数据
export const state = () =>({
    //采用数据接口返回的数据结构
    userInfo:{
        token:"",
        user:{}
    }
})

export const mutations = {
    //保存用户信息到state
    setUserInfo(state,data){
        state.userInfo = data;
    },
    clearUserInfo(state){
        state.userInfo = {
            token:"",
            user:{}
        }
    }
};
export const actions = {
    //调用登录的接口
    login({commit},data){
        return this.$axios({
            url:"/accounts/login",
            method:"POST",
            data
        }).then(res =>{
            //保存到state
            commit ('setUserInfo' ,res.data);
            Promise.resolve();
        })
    }
}