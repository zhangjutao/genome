<template>
    <div class="blast">
        <div class="banner">
            <iframe :src="BlastUrl+'/'" name="blast"></iframe> 
        </div>
    </div>
</template>

<script>

export default {
    name: 'Blast',
    data () {
        return {
           BlastUrl: window.g.BlastUrl,
           sequence:"",
           databases:"",
           blastDataLength:""
        }
    },
   mounted() {
        $(".blast").height($(window).height()-81-48)
        if(this.$route.query.uid){
            var targetLocation = this.BlastUrl;
            var blastDatas =  JSON.parse(localStorage.getItem("blastData"));
            this.urls = this.$route.query.uid;
            setTimeout(function () {
            window.frames[0].postMessage(blastDatas, targetLocation)
            }, 2000);
        }
    },
    methods:{

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.banner iframe{
    border:none;
}
.blast{
    width: 1200px;
    min-height: 778px;
    margin: 0 auto;
    .banner {
        -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
        background-color: #fff;
        // margin-bottom: 30px;
        iframe {
        // margin: 20px 0;
        width: 1200px;
        height: 750px;
        }
        .version {
            position: absolute;
            top: 101px;
            left: 548px;
        }
        .track {
        position: absolute;
        top: 100px;
        left: 381px;
        }
    }

}
</style>
