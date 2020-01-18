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
                            <input type="email" id="defaultForm-email" class="form-control validate">
                            <label data-error="no valid email" data-success="right" for="defaultForm-email">
                                Email </label>
                        </div>

                        <div class="md-form mb-4">
                            <i class="fas fa-lock prefix"></i>
                            <input type="password" id="defaultForm-pass" class="form-control validate">
                            <label data-error="no valid password" data-success="right"
                                   for="defaultForm-pass">Password</label>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button class="btn-primary">Login</button>
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
                            <input type="text" id="orangeForm-name" class="form-control validate">
                            <label data-error="no valid name" data-success="right"
                                   for="orangeForm-name">Username</label>
                        </div>
                        <div class="md-form mb-5">
                            <i class="fas fa-envelope prefix"></i>
                            <input type="email" id="orangeForm-email" class="form-control validate">
                            <label data-error="no valid email" data-success="right" for="orangeForm-email">Your
                                email</label>
                        </div>

                        <div class="md-form mb-4">
                            <i class="fas fa-lock prefix "></i>
                            <input type="password" id="orangeForm-pass" class="form-control validate">
                            <label data-error="no valid password" data-success="right" for="orangeForm-pass">Your
                                password</label>
                        </div>

                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button class="btn-primary">Sign up</button>
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

    export default {
        components: {MillButton}
    }
</script>

<style>
    .container {
        margin: auto;
        width: 80%;
        padding: 10px;
        position: relative;
        height: 100%;

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