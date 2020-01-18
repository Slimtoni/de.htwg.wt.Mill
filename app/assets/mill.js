window.Vue = require('vue');

//import vue components
import MillButton from "./components/MillButton";
import MillBox from "./components/MillBox";
import StatusPanel from "./components/StatusPanel";
import Gameboard from "./components/Gameboard";
import MillFooter from "./components/MillFooter";
import Navbar from "./components/Navbar";
import Rules from "./components/Rules";
import MillLoginPage from "./components/MillLoginPage";


$(document).ready(function () {
    let websocket = new WebSocket("ws://localhost:9000/websocket");

    connectWebSocket(websocket);

    let app = new Vue({
        el: '#mill-app',
        components: {
            MillButton,
            MillBox,
            Gameboard,
            MillFooter,
            Rules,
            Navbar,
            MillLoginPage,
            StatusPanel,
        },
        data: {
            gameboard: [
                {id: 0, x: 10, y: 10, status: "empty"},
                {id: 1, x: 305, y: 10, status: "empty"},
                {id: 2, x: 599, y: 10, status: "empty"},
                {id: 3, x: 107, y: 109, status: "empty"},
                {id: 4, x: 305, y: 109, status: "empty"},
                {id: 5, x: 502, y: 109, status: "empty"},
                {id: 6, x: 207, y: 208, status: "empty"},
                {id: 7, x: 305, y: 206, status: "empty"},
                {id: 8, x: 404, y: 207, status: "empty"},
                {id: 9, x: 10, y: 305, status: "empty"},
                {id: 10, x: 107, y: 305, status: "empty"},
                {id: 11, x: 206, y: 305, status: "empty"},
                {id: 12, x: 404, y: 305, status: "empty"},
                {id: 13, x: 502, y: 305, status: "empty"},
                {id: 14, x: 599, y: 305, status: "empty"},
                {id: 15, x: 207, y: 404, status: "empty"},
                {id: 16, x: 305, y: 405, status: "empty"},
                {id: 17, x: 404, y: 403, status: "empty"},
                {id: 18, x: 107, y: 504, status: "empty"},
                {id: 19, x: 305, y: 504, status: "empty"},
                {id: 20, x: 502, y: 504, status: "empty"},
                {id: 21, x: 10, y: 600, status: "empty"},
                {id: 22, x: 305, y: 602, status: "empty"},
                {id: 23, x: 599, y: 602, status: "empty"}
            ],
            playerOnTurn: "",
            playerOnTurnPhase: undefined,

            playerWhite: "",
            playerWhitePhase: "",
            playerWhitePlacedMen: undefined,
            playerWhiteLostMen: undefined,

            playerBlack: "",
            playerBlackPhase: "",
            playerBlackPlacedMen: undefined,
            playerBlackLostMen: undefined,

            foundMill: false,
            gameRunning: false,

            /* deprecated */
            playerPhase: "",
            currentFieldID: undefined,
            currentField: undefined,
            currentFieldStatus: "",
            startField: undefined,
            targetField: undefined,
            performTurnResult: ""
        },
        methods: {
            performTurn: function (start, target) {
                let data = {};
                data.function = "performTurn";
                if (typeof data.targetField === "undefined") {
                    data.start = start;
                    data.target = -1;
                    websocket.send(JSON.stringify(data));
                } else {
                    data.start = start;
                    data.target = target;
                    websocket.send(JSON.stringify(data));
                }
            },
            checkMill: function (fieldID) {
                let data = {};
                data.function = "checkMill";
                data.field = fieldID;
                websocket.send(JSON.stringify(data));
            },
            caseOfMill: function (fieldID) {
                let data = {};
                data.function = "caseOfMill";
                data.field = fieldID;
                websocket.send(JSON.stringify(data));
            },
            endPlayersTurn: function () {
                let data = {};
                data.function = "endPlayersTurn";
                websocket.send(JSON.stringify(data));
            },
            updateGameboard: function () {
                let data = {};
                data.function = "updateGameboard";
                websocket.send(JSON.stringify(data));
            },
            killMan: function (fieldID) {
                this.getFieldStatus(fieldID);
                this.updateField(fieldID);
            },
            sleep: function (milliseconds) {
                return new Promise(resolve => setTimeout(resolve, milliseconds));
            }
        },

    });
    let csrf = $('input[name="csrfToken"]').attr("name");
    //app.loadPlayer();
    //app.getFieldStatus();
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': csrf,
            'Content-Type': 'application/json',
            //'Accept': 'application/json'
        }
    });

    function connectWebSocket() {

        websocket.onopen = function () {
            app.updateGameboard();
            console.log("Connected to Socket");
        };

        websocket.onclose = function () {
            console.log("Connection closed");
        };

        websocket.onerror = function (error) {
            console.log("Error occured: " + error);
        };

        websocket.onmessage = function (event) {
            if (typeof event.data === "string") {
                let msg = JSON.parse(event.data);
                console.log("Message: " + msg.type);
                if (msg.type === "updateGameboard") {
                    app.playerWhite = msg.game.Players.player1.name;
                    app.playerWhitePhase = msg.game.Players.player1.phase;
                    app.playerWhitePlacedMen = msg.game.Players.player1.placedMen;
                    app.playerWhiteLostMen = msg.game.Players.player1.lostMen;

                    app.playerBlack = msg.game.Players.player2.name;
                    app.playerBlackPhase = msg.game.Players.player2.phase;
                    app.playerBlackPlacedMen = msg.game.Players.player2.placedMen;
                    app.playerBlackLostMen = msg.game.Players.player2.lostMen;

                    app.playerOnTurn = msg.game.Players.playerOnTurn.name;
                    if (app.playerOnTurn === app.playerWhite) {
                        app.playerOnTurnPhase = app.playerWhitePhase;
                    } else {
                        app.playerOnTurnPhase = app.playerBlackPhase;
                    }

                    let gameboardString = msg.game.gameboard.vertexList;
                    for (let i = 0; i < gameboardString.length; i++) {
                        if (gameboardString.charAt(i) === "W") {
                            app.gameboard[i]["status"] = "white";
                        } else if (gameboardString.charAt(i) === "B") {
                            app.gameboard[i]["status"] = "black";
                        } else {
                            app.gameboard[i]["status"] = "empty";
                        }
                    }
                    app.gameRunning = msg.gameRunning
                } else if (msg.type === "performTurn") {
                    if (msg.result === "200") {
                        app.updateGameboard();
                    } else {
                        console.log("func performTurn returned with Error: " + msg.result)
                    }
                } else if (msg.type === "checkMill") {
                    if (msg.foundMill === "true") {
                     app.foundMill = true;
                    } else {
                        app.foundMill = false;
                        console.log("No Mill found!!!");
                    }
                } else if (msg.type === "caseOfMill") {
                    if (msg.result === "200") {
                        app.updateGameboard();
                    } else {
                        console.log("func caseOfMill returned with Error: " + msg.result);
                    }
                }
            }
        }
    }
    /*$('.field').click(async function () {
        //console.log("Field " + $(this).data().id + " clicked!")
        app.currentFieldID = parseInt($(this).attr("id").slice(5, 7));
        app.currentField = $(this);
        app.startField = $(this);
        await app.loadPlayer();

        console.log("loaded Player");
        console.log(app.playerOnTurn + " - " + app.playerPhase);

        if (app.playerOnTurn !== undefined) {
            console.log(app.foundMill);
            if (!app.foundMill) {
                if (app.playerPhase === "Place") {
                    console.log("White Player wants to place");
                    app.performTurn();
                    app.updateField();
                    //await app.checkMill(app.startField);

                    if (!app.foundMill) {
                        console.log("No Mill found!!!");
                        app.endPlayersTurn()
                    }
                } else if (app.playerOnTurn.phase === "Move" || app.playerOnTurn.phase === "Fly") {
                    $('.field').click(function () {
                        app.targetField = parseInt($(this).atthis.$roottr("id").slice(5, 7));
                        //app.performTurn(app.startField, app.targetField, app.playerOnTurn);
                    })
                }
                $('#currentPlayer').text(app.playerOnTurn);
            } else {
                console.log("Found Mill!");
                //await app.caseOfMill(app.startField);
                //await app.updateField(app.startField);
                //app.endPlayersTurn();
            }
            //$('#currentPlayer').text(app.playerOnTurn.player);
        } else {
            console.log("Player is undefiend - Start the game");
        }


    });*/
});
