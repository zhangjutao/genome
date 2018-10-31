<template>
    <div>
        <Header></Header>
        <router-view></router-view>
        <Footer></Footer>
    </div>
 </template>

<script>
import Header from "@/components/header";
import Footer from "@/components/footer";
export default {
    data (){
        return {
            
        }
    },
    components:{
        Header,
        Footer
    },
    methods:{
    
    }
}
</script>

<style lang="scss" scoped>

</style>
