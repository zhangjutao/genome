<template>
    <div class="primerDesign">
        <div class="banner">
            <iframe :src="primerUrl + '/primer3/genome'" name="primer"></iframe>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Primer',
    data () {
        return {
            primerUrl: window.g.PrimerUrl
        }
    },
    methods:{
    
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.primerDesign{
    width: 1200px;
    min-height: 778px;
    margin: 0 auto;
    .banner {
        -webkit-box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
        background-color: #fff;
        margin-bottom: 30px;
        iframe {
        margin: 20px 0;
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
.banner iframe{
    border:none;
    width:1217px;
}

</style>
