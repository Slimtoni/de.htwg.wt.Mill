<template>
    <div v-if="typeof target!== 'undefined'">
        <div v-if="text === 'Leave Game'">
            <a v-on:click="leave" class="btn btn-primary btn-sm" role="button">{{text}}</a>
        </div>
        <div v-else>
            <a v-on:click="start" class="btn btn-primary btn-sm" role="button">{{text}}</a>
        </div>
    </div>

    <div v-else>
        <div v-if="text === 'Leave Game'">
            <a v-on:click="leave" class="btn btn-primary btn-sm" role="button">{{text}}</a>
        </div>
        <div v-else-if="text === 'Start Game' || text === 'Restart Game'">
            <a v-on:click="start" class="btn btn-primary btn-sm" role="button">{{text}}</a>
        </div>
        <div v-else>
            <a v-on:click="start" class="btn btn-primary" type="button" data-toggle="modal" :data-target="target">{{text}}</a>
        </div>

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
            start: function () {
                console.log("Start Game clicked!");
                this.$root.startGame();
            },
            leave: function () {
                console.log("Leave Game clicked!");
                this.$root.gameRunning = false;
            }
        }
    }
</script>