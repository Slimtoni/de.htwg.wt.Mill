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
            clickHandler: async function () {
                let error = false;
                console.log("Field " + this.id + " clicked!");
                this.$root.updateGameboard();
                if (this.$root.gameRunning) {
                    if (this.$root.playerOnTurn !== undefined) {
                        await this.$root.sleep(50);
                        if (!this.$root.foundMill) {
                            if (this.$root.playerOnTurnPhase === "Place") {
                                this.$root.performTurn(this.id, -1).then(function () {
                                    console.log("Perform Turn successfull!")
                                }).catch(err => {
                                    console.log("Perform Turn returned with Error: " + err);
                                    error = true;
                                });
                                if (!error) {
                                    this.$root.checkMill(this.id).then(function () {
                                        console.log("Check Mill successfull!")
                                    }).catch(err => {
                                        console.log("Check Mill returned with Error: " + err);
                                        error = true
                                    })
                                }
                            } else {
                                if (this.$root.firstClick) {
                                    if (this.$root.gameboard[this.id]["status"] === this.$root.playerOnTurn.toLowerCase()) {
                                        this.$root.clickOne = this.id;
                                        this.$root.firstClick = false;
                                        console.log("Field " + this.id + " selected! Choose second Field to " + this.$root.playerOnTurnPhase + "1");
                                    } else {
                                        console.log("Please select one of your own mens to " + this.$root.playerOnTurnPhase)
                                    }
                                } else {
                                    if (this.id === this.$root.clickOne) {
                                        this.$root.clickOne = 0;
                                        this.$root.firstClick = false;
                                        console.log("Field " + this.id + " diselected! Choose a Man to " + this.$root.playerOnTurnPhase + "!");
                                    } else {
                                        this.$root.performTurn(this.$root.clickOne, this.id);
                                        this.$root.checkMill(this.id);
                                        await this.$root.sleep(50);
                                        if (!this.$root.foundMill) {
                                            //console.log("No Mill found!!!");
                                            await this.$root.sleep(50);
                                            this.$root.endPlayersTurn()
                                        }
                                    }
                                }
                            }
                        } else {
                            this.$root.caseOfMill(this.id).then(function () {
                                console.log("CaseOfMill returned successfull!")
                            }).catch(err => {
                                console.log("Perform Turn returned with Error: " + err);
                                error = true;
                            });
                        }
                    }
                }

            }
        }
    }
</script>

<style scoped>

</style>