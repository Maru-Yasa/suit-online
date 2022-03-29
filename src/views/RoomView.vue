<template>
    <div class="">

        <div class="row justify-content-center">

            <div class="col-12 mt-5 text-center">
                <h1>
                    
                    {{ room_name }}
                    <a @click="share()" class="h4 text-center" href="javascript:void(0">
                        <b-icon icon="share-fill"></b-icon>
                    </a>    
                </h1> 

            </div>

            <div class="col-12 col-md-6 mt-5 mb-5 row justify-content-center">
                <div class="col-5 mx-2 text-center p-0">
                    <div class="mb-2">
                        status : {{ room['users'][self.user_id]['status'] }}
                        <br>
                        score  : {{ room['users'][self.user_id]['score'] }}
                    </div>
                    <div class="card my-gray text-secondary rounded-lg col-12 border-0 p-3">
                        <div class="card-title text-center">
                            {{ self.username }} (You)
                        </div>
                        <div class="card-body text-center">
                            <span v-if="show" class="fs-1">
                                {{ emots[room["data"][self.user_id]] }}
                            </span>
                            <span v-else class="fs-1">
                                🤔
                            </span>
                        </div>
                    </div>
                </div>
                <div class="col-5 mx-2 text-center p-0">
                    <div class="mb-2">
                        status : {{ getOpponent.status }}
                        <br>
                        score  : {{ getOpponent.score }}
                    </div>                    
                    <div class="card my-gray text-secondary rounded-lg col-12 border-0 p-3">
                        <div class="card-title text-center">
                            {{ getOpponent.username }}
                        </div>
                        <div class="card-body text-center">
                            <span v-if="show" class="fs-1">
                                {{ emots[room["data"][getOpponent['user_id']]] }}

                            </span>
                            <span v-else class="fs-1">
                                🤔
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-7 mt-5 row justify-content-center">

                <a @click="pick('rock')" href="javascript:void(0)" class="text-secondary col-3 card card-hover rounded-lg border-2 mx-1 mx-md-3 px-2 py-5">
                    <div class="card-body text-center">
                        <span class="fs-3">
                            ✊
                        </span>
                    </div>
                </a>
                <a @click="pick('paper')" href="javascript:void(0)" class="text-secondary col-3 card card-hover rounded-lg border-2 mx-1 mx-md-3 px-2 py-5">
                    <div class="card-body text-center">
                        <span class="fs-3">
                            🖐
                        </span>
                    </div>
                </a>
                <a @click="pick('cissor')" href="javascript:void(0)" class="text-secondary col-3 card card-hover rounded-lg border-2 mx-1 mx-md-3 px-2 py-5">
                    <div class="card-body text-center">
                        <span class="fs-3">
                            🤞
                        </span>
                    </div>
                </a>

            </div>

        </div>

    </div>
</template>

<script>
import QRCode from 'qrcode'
// 🤔 ✊ 🖐🤞
export default {
    name:"RoomView",
    sockets:{

        room_full(){
            this.$swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'room is full',
                confirmButtonText:"spectre"
            });
            this.player = false;
        },
        room_joined(data){

            this.$swal.fire

            this.player = true;
            this.room_name = data.room_name;
            this.user_count = data.room.users_count;
            this.room = data.room;
            this.data_count = this.room.data_count;
            if(this.user_count >= 2){
                this.ready = true;
            }
        },
        new_data(data){
            this.room = data;
            this.data_count = this.room.data_count;
            if(this.room.data_count == 2){
                this.show = true;
                this.judge(this.room.data);
            }
        },
        self(data){
            this.self = data;
        },
        log_join(username){
            this.$swal.fire({
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2500,
                    icon : "info",
                    title : `${username} has joined`
            });
        },
        log_disconnect(username){
            this.$swal.fire({
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2500,
                    icon : "info",
                    title : `${username} has disconnected`
            });         
        }
    },
    computed : {
        getOpponent(){
            if(this.user_count < 2){
                return {
                    username:"waiting..."
                }
            }else{
                var self_id = this.self.user_id;
                var users = this.room.users;
                var opponent = {};
                Object.keys(users).forEach(key => {
                    if(key != self_id){
                        opponent = users[key];
                    }
                });
                // console.log(opponent);
                return opponent;
            }
        }
    },
    mounted(){
        if (this.$store.state.username != '') {
            this.username = this.$store.state.username;
            this.$store.commit('deleteUsername');
            var data = {
                room_id:this.room_id,
            };
            this.$socket.emit('join_room',data)
        }else{
            this.$swal.fire({
                title: 'Create username',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showDenyButton: true,
                html: `<input type="text" id="username" class="swal2-input" placeholder="Username">`,
                confirmButtonText: 'Join',
                focusConfirm: false,
                preConfirm: () => {
                    const username = this.$swal.getPopup().querySelector('#username').value
                    if (!username) {
                        this.$swal.showValidationMessage(`Please enter login and password`)
                    }
                    return { username:username }
                }
                }).then((res) => {
                    this.username = res.value.username;
                    this.$socket.emit('new_user', res.value.username);
                    var data = {
                        room_id:this.room_id,
                    };
                    this.$socket.emit('join_room',data)
                });
        }
    },
    methods:{
        pick(value){
            if(this.room['data_count'] == 2){
                var self_data = this.room['data'][this.self.userId];
                var opponent_data = this.room['data'][this.getOpponent.userId];
                // console.log({
                //     self_data,
                //     opponent_data
                // });
            }

            if(this.ready){
                this.$socket.emit('picked',{
                    room_id:this.room_id,
                    card:value,
                });
                this.ready = false;
            }else{
                this.$swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Opponent not ready yet or you just picked',
                    confirmButtonText:"ok"
                });            
            }

        },
        judge(data){
            // console.log(data);
            var self = this.self;
            var opponent = this.getOpponent;
            var win = null;
            self.data = data[self.user_id];
            opponent.data = data[opponent.user_id];

            if (self.data == 'rock') {
                if(opponent.data == 'paper'){
                    win = false;
                }else if(opponent.data == "cissor"){
                    win = true
                }else{
                    win = 'tie';
                }
            }else if(self.data == 'paper'){
                if(opponent.data == 'cissor'){
                    win = false;
                }else if(opponent.data == "rock"){
                    win = true
                }else{
                    win = 'tie';
                }
            }else if(self.data == 'cissor'){
                if(opponent.data == 'rock'){
                    win = false;
                }else if(opponent.data == "paper"){
                    win = true
                }else{
                    win = 'tie';
                } 
            }

            if(win == true){
                this.$swal.fire({
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3500,
                    icon : "success",
                    title : `You win 🥳 (${this.getData(this.self.user_id)} vs ${this.getData(this.getOpponent.user_id)})`
                });
                this.$socket.emit('win', this.room_id);
                setTimeout(this.restartWinner, 5000);
            }
            else if (win == false){
                this.$swal.fire({
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3500,
                    icon : "error",
                    title : `You lose 😜 (${this.getData(this.self.user_id)} vs ${this.getData(this.getOpponent.user_id)})`
                });
                this.$socket.emit('lose', this.room_id);
                setTimeout(this.restartLoser, 5000);
            }
            else if (win == 'tie'){
                this.$swal.fire({
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3500,
                    icon : "info",
                    title : `Tie (${this.getData(this.self.user_id)} vs ${this.getData(this.getOpponent.user_id)})`
                });
                this.$socket.emit('tie', this.room_id);
                setTimeout(this.restartWinner, 5000);
            }


        },
        restartWinner(){
            this.show = false;
            this.ready = true;
        },
        restartLoser(){
            this.show = false;
            this.ready = true;
        },
        getData(user_id){
            return this.emots[this.room.data[user_id]];
        },
        share(){
            this.$swal.fire({
                icon: 'success',
                title: 'Share this room',
                confirmButtonText:"ok",
                html:`
                
                <canvas id='qrcode'></canvas>
                
                `,
            });
            QRCode.toCanvas(document.getElementById('qrcode'), `${import.meta.env.VITE_APP_BASE_URL}/#/room/${this.room_id}`)
        }
    },
    data(){
        return {
            room_id : this.$route.params.id,
            player:true,
            room_name :'',
            user_count : 0,
            username:'',
            room : {},
            data_count :null,
            self : null,
            opponent : {},
            ready : false,
            show : false,
            emots:{
                "rock":"✊",
                "paper":"🖐",
                "cissor":"🤞"
            },
        }
    },
}
</script>