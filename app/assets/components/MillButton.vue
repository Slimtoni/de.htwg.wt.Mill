<template>
    <div v-if="text!== undefined">
        <a v-on:click="startGame" class="btn btn-primary" role="button">{{text}}</a>
    </div>
    <div v-else-if="typeof target!== 'undefined'">
        <a v-on:click="startGame" class="btn btn-primary" type="button" data-toggle="modal" :data-target="target">{{text}}</a>
    </div>
    <div v-else>
        <a> error </a>
    </div>
</template>

<style>
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

    a {
        color: #e05435;
    }

    a:hover {
        color: #5CBBB7;
    }

    a:not([href]):not([tabindex]) {
        color: white;
    }
</style>

<script>
    export default {
        props: {
            text: {
                type: String
            },
            target: {
                type: String
            }
        },
        name: "MillButton",
        methods: {
            startGame: function () {
                console.log("Start Game clicked!");
                this.$root.start();
            }
        }
    }
</script>