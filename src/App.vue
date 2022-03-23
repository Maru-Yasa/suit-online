<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name:'app',
  sockets: {
        connect: function () {
            console.log('socket connected')
        },
  },
}
</script>

<style>

.my-gray{
  background-color: #EFEFEF;
  text-decoration: none;
}

.card-hover{
  border-color: #EFEFEF;
}

.card-hover:hover{
  background-color: #EFEFEF;
}

</style>
