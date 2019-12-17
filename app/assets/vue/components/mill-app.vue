<template>
    <div class="mill-app">
        <p>test</p>
    </div>

</template>

<script lang="ts">
    import Vue from 'vue';
    Vue.component('button', require('./common/_mill-button.vue').default());

    export default Vue.extend({});
</script>

<style scoped lang="scss">
    .greeting-form {
        display: block;
        text-align: center;
        padding: 25px 0px;
    }
</style>