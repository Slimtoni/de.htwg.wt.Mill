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

                this.$root.loadPlayer();
                if (this.$root.playerOnTurn !== undefined) {
                    console.log(this.$root.foundMill);
                    if (!this.$root.foundMill) {
                        if (this.$root.playerPhase === "Place") {
                            console.log("White Player wants to place");
                            this.$root.performTurn(this.id, undefined);
                            this.updateField();
                            //await app.checkMill(app.startField);

                            if (!this.$root.foundMill) {
                                console.log("No Mill found!!!");
                                this.$root.endPlayersTurn()
                            }
                        }
                    }
                }
            },
            updateField: function () {
                this.$root.getFieldStatus(this.id);
            }
        }
    }
</script>

<style scoped>

</style>