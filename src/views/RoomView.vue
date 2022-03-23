<template>
    <div class="container">

        <div class="row justify-content-center">

            <div class="col-12 mt-5 text-center">
                <h1>{{ room_name }}</h1>
            </div>

            <div class="col-12 col-md-6 mt-5 mb-5 row justify-content-center">
                <div class="col-4 mx-4 text-center p-0">
                    <div class="mb-2">
                        status : {{ room['users'][self.user_id]['status'] }}
                    </div>
                    <div class="card my-gray text-secondary rounded-lg col-12 border-0 p-3">
                        <div class="card-title text-center">
                            {{ self.username }} (You)
                        </div>
                        <div class="card-body text-center">
                            <span v-if="show" class="fs-1">
                                {{ room["data"][self.user_id] }}
                            </span>
                            <span v-else class="fs-1">
                                🤔
                            </span>
                        </div>
                    </div>
                </div>

                <div class="col-4 mx-4 text-center p-0">
                    <div class="mb-2">
                        status : {{ getOpponent.status }}
                    </div>                    
                    <div class="card my-gray text-secondary rounded-lg col-12 border-0 p-3">
                        <div class="card-title text-center">
                            {{ getOpponent.username }}
                        </div>
                        <div class="card-body text-center">
                            <span v-if="show" class="fs-1">
                                {{ room["data"][getOpponent['user_id']] }}
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
            this.player = true;
            this.room_name = data.room_name;
            this.user_count = data.room.users_count;
            this.room = data.room;
            console.log(this.user_count);
            if(this.user_count >= 2){
                this.ready = true;
            }
        },
        new_data(data){
            this.room = data;
            console.log(this.room);
            if(this.room.data_count == 2){
                this.show = true;
            }
        },
        self(data){
            this.self = data;
        },

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
                console.log(opponent);
                return opponent;
            }
        }
    },
    mounted(){
        if (this.$route.query.username) {
            this.username = this.$route.query.username;
            var data = {
                room_id:this.room_id,
            };
            this.$socket.emit('join_room',data)
        }else{
            this.$swal.fire({
                title: 'Create username',
                html: `<input type="text" id="username" class="swal2-input" placeholder="Username">`,
                confirmButtonText: 'Sign in',
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
            self : null,
            opponent : {},
            ready : false,
            show : false,
        }
    },
}
</script>