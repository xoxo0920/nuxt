import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
    window.onNuxtReady(() => {
        createPersistedState({
            //key的值保存到本地的时候的属性名
            key: "store", // 读取本地存储的数据到store
        })(store)
    })
}