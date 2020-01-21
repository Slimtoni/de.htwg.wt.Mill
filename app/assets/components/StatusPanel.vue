<template>
    <div class="container">
        <div class="jumbotron header-jumbotron d-flex flex-column statuspanel">
            <div class="row justify-content-between">
                <div class="col-4">
                    <mill-button :text="'Leave Game'"></mill-button>
                </div>
                <div class="col-2">
                    <mill-button class="millbutton restart" :text="'Restart Game'"></mill-button>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col text-center">
                    <div v-if="$root.playerOnTurnPhase === 'Place'">
                        <i :style="[$root.playerOnTurn !== 'White' ? {'color': '#FFDE63'} : {'color' : '#5CBBB7'}]" class="fas fa-map-marker-alt fa-4x"></i>
                        <p :style="{'color': 'black'}" class="text-center font-weight-bolder mt-3">Place</p>
                    </div>
                    <div v-else-if="$root.playerOnTurnPhase === 'Move'">
                        <i :style="[$root.playerOnTurn !== 'White' ? {'color': '#FFDE63'} : {'color' : '#5CBBB7'}]" class="fas fa-arrows-alt fa-4x"></i>
                        <p :style="{'color': 'black'}" class="text-center font-weight-bolder mt-3">Move</p>
                    </div>
                    <div v-else-if="$root.playerOnTurnPhase === 'Fly'">
                        <i :style="[$root.playerOnTurn !== 'White' ? {'color': '#5CBBB7'} : {'color' : '#FFDE63'}]" class="fas fa-paper-plane fa-4x"></i>
                        <p :style="{'color': 'black'}" class="text-center font-weight-bolder mt-3">Fly</p>
                    </div>
                    <div v-if="$root.foundMill === true" class="alert alert-warning" role="alert">
                        Mill found! Pls remove a Man!
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <span class="badge" :style="{'background-color': '#5CBBB7'}">Blue</span>
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
                <gameboard :gameboard="gameboard"></gameboard>
            </div>
            <div class="col">
                <span class="badge" :style="{'background-color': '#FFDE63'}">Yellow</span>
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
    </div>
</template>

<script>
    import MillButton from "./MillButton";
    import Gameboard from "./Gameboard";
    export default {
        name: "StatusPanel",
        components: {
          MillButton,
          Gameboard
        },
        props: {
            playerOnTurn: {
                type: String
            },
            playerOnTurnPhase: {
                type: String
            },
            statusInfo: "",
            statusMessage: "",
            gameboard: {
                type: Array
            }
        }
    }
</script>

<style scoped>
    @media (max-width: 800px) {
        .container {
            width: 90%;
            margin: 0 auto;
        }

    }

    @media (max-width: 470px) {
        .container {
            width: 90%;
        }
        .navbar-brand{
            font-size: 14px;
        }
    }

    @media (max-width: 390px) {
        .navbar-brand{
            font-size: 12px;
        }

    }

    .restart {
        align: right;
    }
    .row {
        margin-top: 0px;
    }
    .statuspanel {
        padding: 3px;
    }
    .badge {
        color: black;
    }
    .millbutton {
        float: left;
    }
</style>