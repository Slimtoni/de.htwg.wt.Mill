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
            participants: [],

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
            updateGameboard: function () {
                let data = {};
                data.function = "updateGameboard";
                websocket.send(JSON.stringify(data));
            },
            performTurn: function (start, target) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        type: 'POST',
                        url: '/turn',
                        data: JSON.stringify({
                            start: start,
                            target: target
                        }),
                        success: function () {
                            app.updateGameboard();
                            resolve();
                        },
                        error: function () {
                            console.log("error");
                            app.updateGameboard();
                            reject()
                        }
                    })
                })
            },
            checkMill: function (fieldID) {
                return new Promise(function (resolve, reject) {
                    return $.ajax({
                        type: 'POST',
                        url: '/check',
                        data: JSON.stringify({
                            field: fieldID
                        }),
                        success: function (data) {
                            if (data === "true") {
                                app.foundMill = true;
                                console.log("FoundMill set True. " + this.foundMill);
                                resolve();
                            } else {
                                app.foundMill = false;
                                app.endPlayersTurn();
                                resolve();
                            }
                        },
                        error: function (data) {
                            reject(data);
                        }
                    })
                })
            },
            caseOfMill: function (fieldID) {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        type: 'POST',
                        url: '/caseofmill',
                        data: JSON.stringify({
                            field: fieldID
                        }),
                        success: function () {
                            app.updateGameboard();
                            app.foundMill = false;
                            app.endPlayersTurn();
                            resolve();
                        },
                        error: function () {
                            console.log("error");
                            app.updateGameboard();
                            reject()
                        }
                    })
                })
            },
            endPlayersTurn: function () {
                let data = {};
                data.function = "endPlayersTurn";
                websocket.send(JSON.stringify(data));
            },
            sleep: function (milliseconds) {
                return new Promise(resolve => setTimeout(resolve, milliseconds));
            },
            start: function () {
                let data = {};
                data.function = "startGame";
                websocket.send(JSON.stringify(data));
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
                }
            }
        }
    }
});
