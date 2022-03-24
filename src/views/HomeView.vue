<template>
  <div class="">
    <div class="row mt-5 justify-content-center">

      <div class="col-10 row justify-content-center">
        <div class="col-12 col-md-6  rounded-lg border border-1 p-5">
          <h2 class="mb-4">Make Room</h2>
          <input type="text" class="form-control" v-model="username" placeholder="Username" required>
          <br>
          <input type="text" class="form-control" v-model="room_name" placeholder="Room name" required>
          <br>
          <a href="javascript:void(0)" @click="createRoom" class="btn btn-primary">Create Room</a>
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
      if(this.username == '' || this.room_name == ''){
        this.$swal.fire({
          icon:'error',
          title:'oops..',
          text:'username and password must be initialized'
        });
      }else{
        this.$store.commit('setUsername', this.username);
        this.$socket.emit('new_user', this.username);
        let data = {
          room_name:this.room_name, 
        };
        let url = process.env.VUE_APP_API_URL + "/room";
        axios.post(url, data).then((res) => {
          if(res.status == 200){
            this.$router.push({
                path:`/room/${res.data.room_id}`,
              })
          }
        });
      }

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
