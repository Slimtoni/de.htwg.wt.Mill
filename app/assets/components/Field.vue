<template>
    <use class="field" :id="`field${id}`" :x="x" :y="y" :xlink:href="`#${status}`" :width="40" :height="40" />
</template>

<script>
    export default {
        props: {
            id: {
                type: Number
            },
            x: {
                type: Number
            },
            y: {
                type: Number
            },
            status: {
                type: String,
                default: "empty"
            }
        },
        name: "Field"
    }
</script>

<style scoped>

</style>