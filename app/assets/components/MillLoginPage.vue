<template>
    <div class="container">
        <mill-button :target="'#loginModal'" :text="'Login'"></mill-button>
        <mill-button :target="'#registerModal'" :text="'Register'"></mill-button>

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
                            <label data-error="no valid email" data-success="right" for="defaultForm-email"> Email </label>
                        </div>

                        <div class="md-form mb-4">
                            <i class="fas fa-lock prefix"></i>
                            <input type="password" id="defaultForm-pass" class="form-control validate">
                            <label data-error="no valid password" data-success="right" for="defaultForm-pass">Password</label>
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
                            <i class="fas fa-user prefix grey-text"></i>
                            <input type="text" id="orangeForm-name" class="form-control validate">
                            <label data-error="no valid name" data-success="right" for="orangeForm-name">Your name</label>
                        </div>
                        <div class="md-form mb-5">
                            <i class="fas fa-envelope prefix grey-text"></i>
                            <input type="email" id="orangeForm-email" class="form-control validate">
                            <label data-error="no valid email" data-success="right" for="orangeForm-email">Your email</label>
                        </div>

                        <div class="md-form mb-4">
                            <i class="fas fa-lock prefix grey-text"></i>
                            <input type="password" id="orangeForm-pass" class="form-control validate">
                            <label data-error="no valid password" data-success="right" for="orangeForm-pass">Your password</label>
                        </div>

                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button class="btn-primary">Sign up</button>
                    </div>
                </div>
            </div>
        </div>


        <!-- Page -->




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

    }

    .btn-primary {
        background-color: #e05435 !important;
        border: #e05435;
        color: white;
        border-radius: 5px;
    }

    .btn-primary:hover {
        background-color: #5CBBB7 !important;
        color: black !important;
    }
</style>