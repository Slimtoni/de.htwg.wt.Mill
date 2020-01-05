<template>
    <a class="btn btn-primary" :href="url" role="button">{{text}}</a>
</template>

<style>
    .btn-primary {
        background-color: #e05435;
        border: #e05435;
    }

    .btn-primary:hover {
        background-color: #5CBBB7;
    }
</style>

<script>
    export default {
        props: {
            url: {
                type: String
            },
            text : {
                type: String
            }
        },
        name: "MillButton"
    }
</script>