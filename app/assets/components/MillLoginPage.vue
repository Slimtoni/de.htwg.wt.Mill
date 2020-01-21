<template>
    <div class="container">
            <!-- Login modal-->
            <div class="modal fade" id="loginModal" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header text-center">
                            <h4 class="modal-title w-100 font-weight-bold">Login</h4>
                            <button type="button" class="close" data-dismiss="modal">
                                <i class="fas fa-window-close"></i>
                            </button>
                        </div>
                        <div class="modal-body mx-3">
                            <div class="md-form mb-5">
                                <i class="fas fa-envelope prefix "></i>
                                <input type="email" id="login-email" class="form-control validate" v-model="loginemail">
                                <label data-error="no valid email" data-success="right" for="login-email">
                                    Email </label>
                            </div>

                            <div class="md-form mb-4">
                                <i class="fas fa-lock prefix"></i>
                                <input type="password" id="login-password" v-model="loginpassword"
                                       class="form-control validate">
                                <label data-error="no valid password" data-success="right"
                                       for="login-password">Password</label>
                            </div>
                        </div>
                        <div class="modal-footer d-flex justify-content-center">
                            <button v-on:click="login" class="btn-primary">Login</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Register modal-->
            <div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header text-center">
                            <h4 class="modal-title w-100 font-weight-bold">Sign up</h4>
                            <button type="button" class="close" data-dismiss="modal">
                                <i class="fas fa-window-close"></i>
                            </button>
                        </div>
                        <div class="modal-body mx-3">
                            <div class="md-form mb-5">
                                <i class="fas fa-user prefix"></i>
                                <input type="text" id="registerusername" v-model="registerusername"
                                       class="form-control validate">
                                <label data-error="no valid name" data-success="right"
                                       for="registerusername">Username (3 Symbols min)</label>
                            </div>
                            <div class="md-form mb-5">
                                <i class="fas fa-envelope prefix"></i>
                                <input type="email" id="registeremail" v-model="registeremail"
                                       class="form-control validate">
                                <label data-error="no valid email" data-success="right" for="registeremail">Your
                                    email</label>
                            </div>

                            <div class="md-form mb-4">
                                <i class="fas fa-lock prefix "></i>
                                <input type="password" id="registerpassword" v-model="registerpassword"
                                       class="form-control validate">
                                <label data-error="no valid password" data-success="right" for="registerpassword">Your
                                    password (8 Symbols min)</label>
                            </div>

                        </div>
                        <div class="modal-footer d-flex justify-content-center">
                            <button v-on:click="register" class="btn-primary">Sign up</button>
                        </div>
                    </div>
                </div>
            </div>


            <!-- Page -->
            <div class="container navless-container">
                <div class="content">
                    <div class="row mt-3">
                        <div class="col-sm-12">
                            <h1 class="mb-3 font-weight-normal">Welcome to nine mens morris</h1>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-sm-8 order-12 order-sm-1 brand-holder">
                            <h3 class="mt-sm-0">The best game in the world</h3>
                            <p>Play an epic game with one other person and dominate him/her/it.</p>
                        </div>
                        <div class="col-sm-4 order-12 order-sm-1 brand-holder">
                            <div id="login-container">
                                <mill-button :target="'#loginModal'" :text="'Login'"></mill-button>
                                <mill-button :target="'#registerModal'" :text="'Register'"></mill-button>
                            </div>
                        </div>
                    </div>
                    <!--<div class="row mb-3">
                        <div class="col-sm-7 order-12 order-sm-1 brand-holder">
                            <h3 class="mt-sm-0">The best game in the world</h3>
                            <p>Play an epic game with one other person and dominate him/her/it.</p>
                        </div>
                    </div>-->
                </div>
            </div>
        </div>
</template>

<script>

    import MillButton from "./MillButton";

    $.ajaxSetup({
        headers: {
            'Content-Type': 'application/json',
            //'Accept': 'application/json'
        }
    });


    export default {
        components: {MillButton},
        data() {
            return {
                loginemail: '',
                loginpassword: '',
                registerusername: '',
                registeremail: '',
                registerpassword: ''
            }
        },
        methods: {
            login: function () {
                console.log("login");
                if (this.loginemail.length > 6 && this.loginpassword.length >= 8) {
                    $.post("http://localhost:9000/login",
                        JSON.stringify({
                            email: this.loginemail,
                            password: this.loginpassword
                        }),
                    )
                        .done(function (data, status, xhr) {
                            if (xhr.status === 200) {
                                console.log("login successful");
                                window.location.replace("http://localhost:9000/")
                            } else if (xhr.status === 400) {
                                console.log("login not successful");
                            } else {
                                console.log("error");
                            }
                        })
                } else {
                    console.log("login error");
                }
            },

            register: function () {
                console.log("register");
                if (this.registerusername.length >= 3 && this.registeremail.length > 6 && this.registerpassword.length >= 8) {
                    $.post("http://localhost:9000/register",
                        JSON.stringify({
                            username: this.registerusername,
                            email: this.registeremail,
                            password: this.registerpassword
                        }),
                    )
                        .done(function (data, status, xhr) {
                            if (xhr.status) {
                                console.log("register successful");
                                window.location.replace("http://localhost:9000/loginpage");
                            } else if (xhr.status === 400) {
                                console.log("register not possible")
                            } else {
                                console.log("error");
                            }
                        })
                        .fail(function (data) {
                            console.log("request failed");
                            console.log("faildata " + data);
                        })
                } else {
                    console.log("register error");
                }
            }
        }
    }

</script>

<style>

    .container {
        margin: auto;
        width: 80%;
        padding: 10px;
        position: relative;
        min-height: 100vh;

    }


    .content {
        margin-top: 50px;
    }

    .row {
        margin-top: 30px;
    }


    .buttons {
        margin: auto;
    }

    .btn-primary {
        background-color: #e05435 !important;
        border: #e05435;
        color: white;
        border-radius: 5px;
        width: 140px;
    }

    .btn-primary:hover {
        background-color: #5CBBB7 !important;
        color: black !important;
    }


</style>