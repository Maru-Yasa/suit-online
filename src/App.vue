<template>
  <div id="app">

    <NavbarComponent />
    <div class="container mb-5" style="height:100%;">
      <router-view/>
    </div>
    <div class="footer fw-thin text-center mb-3">
      created with 🥰 by maru - 2022
    </div>
  </div>
</template>

<script>
import NavbarComponent from '@/components/NavbarComponent.vue';
export default {
  name:'app',
  components: {
    NavbarComponent
  },
  sockets: {
        connect: function () {
            console.log('socket connected')
        },
  },
}
</script>

<style>

.my-gray{
  background-color: #EFEFEF !important;
}

.card-hover{
  border-color: #EFEFEF !important;
  text-decoration: none;
}

.card-hover:hover{
  background-color: #EFEFEF;
}

</style>
