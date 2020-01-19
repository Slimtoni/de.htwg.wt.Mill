<template>
    <div class="jumbotron header-jumbotron d-flex flex-column justify-content-center align-items-center">
        <div class="row">
            <div class="col">
                <span class="badge badge-light">Blue</span>
                <div class="row">
                    <div class="col">
                        <span>PlacedMen: {{$root.playerWhitePlacedMen}}</span>
                    </div>
                    <div class="col">
                        <span>LostMen: {{$root.playerWhiteLostMen}}</span>
                    </div>
                </div>
            </div>
            <div class="col text-center">
                <i v-if="$root.playerOnTurnPhase === 'Place'" :style="[$root.playerOnTurn !== 'White' ? {'color': '#5CBBB7'} : {'color' : '#FFDE63'}]" class="fas fa-map-marker-alt fa-4x"></i>
                <i v-else-if="$root.playerOnTurnPhase === 'Move'" :style="[$root.playerOnTurn !== 'White' ? {'color': '#5CBBB7'} : {'color' : '#FFDE63'}]" class="fas fa-arrows-alt fa-4x"></i>
                <i v-else-if="$root.playerOnTurnPhase === 'Fly'" :style="[$root.playerOnTurn !== 'White' ? {'color': '#5CBBB7'} : {'color' : '#FFDE63'}]" class="fas fa-paper-plane fa-4x"></i>
            </div>
            <div class="col">
                <span class="badge badge-dark">Yellow</span>
                <div class="row">
                    <div class="col">
                        <span>PlacedMen: {{$root.playerBlackPlacedMen}}</span>
                    </div>
                    <div class="col">
                        <span>LostMen: {{$root.playerBlackLostMen}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="$root.foundMill === true" class="alert alert-warning" role="alert">
            Mill found! Pls remove a Man!
        </div>
    </div>
</template>

<script>
    export default {
        name: "StatusPanel",
        props: {
            playerOnTurn: {
                type: String
            },
            playerOnTurnPhase: {
                type: String
            },
            statusInfo: "",
            statusMessage: ""
        }
    }
</script>

<style scoped>
    .badge-light {
        background-color: #5CBBB7;
    }
    .badge-dark {
        background-color: #FFDE63;
        color: black;
    }
</style>