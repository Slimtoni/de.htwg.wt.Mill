<template>
    <div class="container">
        <mill-button :target="'#loginModal'" :text="'Login'"></mill-button>
        <mill-button :target="'#myModal'" :text="'Register'"></mill-button>


        <div class="modal fade" id="loginModal" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header text-center">
                        <h4 class="modal-title w-100 font-weight-bold">Login</h4>
                        <button type="button" class="close" data-dismiss="modal" aria-label="close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body mx-3">
                        <div class="md-form mb-5">
                            <i class="fas fa-envelope prefix "></i>
                            <input type="email" id="defaultForm-email" class="form-control validate">
                            <label data-error="wrong" data-success="right" for="defaultForm-email"> Email </label>
                        </div>

                        <div class="md-form mb-4">
                            <i class="fas fa-lock prefix"></i>
                            <input type="password" id="defaultForm-pass" class="form-control validate">
                            <label data-error="wrong" data-success="right" for="defaultForm-pass">Password</label>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-center">
                        <button class="btn-default">Login</button>
                    </div>
                </div>
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

    }
</style>