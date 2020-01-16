<template>
    <use @click="clickHandler" class="field" :id="`field${id}`" :x="x" :y="y" :xlink:href="`#${status}`" :width="40" :height="40" />
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
                type: String
            }
        },
        name: "Field",
        methods: {
            clickHandler: function () {
                console.log("Field " + this.id + " clicked!");
                this.$root.updateGameboard();

                if (this.$root.playerOnTurn !== undefined) {
                    if (!this.$root.foundMill) {
                        if (this.$root.playerOnTurnPhase === "Place") {
                            this.$root.performTurn(this.id, undefined);
                            this.$root.checkMill(this.id);

                            if (!this.$root.foundMill) {
                                console.log("No Mill found!!!");
                                this.$root.endPlayersTurn()
                            }
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>