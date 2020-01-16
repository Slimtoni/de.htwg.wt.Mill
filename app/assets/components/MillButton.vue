<template>
    <div v-if="typeof url!== 'undefined'">
        <a class="btn btn-primary" :href="url" role="button">{{text}}</a>
    </div>
    <div v-else-if="typeof target!== 'undefined'">
        <a class="btn btn-primary" type="button" data-toggle="modal" :data-target="target">{{text}}</a>
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
            url: {
                type: String
            },
            text: {
                type: String
            },
            target: {
                type: String
            }
        },
        name: "MillButton"
    }
</script>