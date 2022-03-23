<template>
  <div class="container">

    <div class="row justify-content-center">

      <div class="col-10 text-center">
        <h1 class="text-success">SUIT ONLINE</h1>
      </div>

      <div class="col-10">
        <div class="mb-3 col-5">
          <label for="username" class="form-label">Username :</label>
          <input type="text" v-model="username" class="form-control" >
        </div>
        <div class="mb-3 col-5">
          <label for="username" class="form-label">Room name :</label>
          <input type="text" v-model="room_name" class="form-control" >
        </div>
        <div class="mb-3 col-5">
          <input class="btn btn-secondary" type="button" value="Create room" @click="createRoom">
        </div>
      </div>

    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';

export default {
  name: 'HomeView',
  sockets:{

  },
  methods : {
    createRoom(){
      this.$socket.emit('new_user', this.username);
      let data = {
        room_name:this.room_name, 
      };
      let url = process.env.VUE_APP_SOCKET_URL + "/room";
      axios.post(url, data).then((res) => {
        if(res.status == 200){
          this.$router.push({
              path:`/room/${res.data.room_id}?username=${this.username}`,
            })
        }
      });
    },
  },
  data(){
    return {
      username :"",
      room_name:"",
      api_url : process.env.VUE_APP_API_URL,
    }
  },
}
</script>
