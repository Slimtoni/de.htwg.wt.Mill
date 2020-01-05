<template>
    <div class="box">
        <p v-html="description"></p>
        <template v-if=" typeof list!== 'undefined'">
        <ol>
           <li v-for="entry in list" :key="entry.id">
               {{entry.text}}
           </li>
        </ol>
        </template>
    </div>

</template>

<style>
    .box {
        background-color: #efecef;
        padding: 1em;
        margin-bottom: 10px;
        margin-top: 10px;
        border-radius: 10px;
        border: 1px solid

    }
</style>

<script>

    export default {
        props: {
            description: {
                type: String
            },
            list: {
                type: Array
            }
        },
        name: "MillBox"
    }

</script>