let csrf = $('input[name="csrfToken"]').attr("name");

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': csrf,
        'Content-Type': 'application/json',
        //'Accept': 'application/json'
    }
});

function connectWebSocket() {
    let websocket = new WebSocket("ws://localhost:9000/websocket");
    websocket.setTimeout;

    websocket.onopen = function (event) {
        console.log("Connected to Socket");
    };

    websocket.onclose = function (event) {
        console.log("Connection closed");
    };

    websocket.onerror = function (error) {
        console.log(error);
    };

    websocket.onmessage = function (event) {
        if (typeof event.data === "string") {
        }
    }
}

function place(field, player) {
    console.log("Player: " + player.player);
    if (player.player === "White") {
        console.log("place White Stone!");
        field.attr("xlink:href", "#white");
    } else if (player.player === "Black") {
        console.log("place Black Stone!");
        field.attr("xlink:href", "#black");
    }
}

function move(field1, field2, player) {
    if (player === "Black") {
        field1.attr("xlink:href", "#empty");
        field2.attr("xlink:href", "#black");
    } else if (player === "White") {
        field1.attr("xlink:href", "#empty");
        field2.attr("xlink:href", "#white");
    }
}

function performTurn(startField, targetField, player) {
    let startID = parseInt($(startField).attr("id").slice(5, 7));
    if (targetField === undefined) {
        return new Promise(resolve => {
            $.ajax({
                type: 'POST',
                url: '/turn',
                data: JSON.stringify({
                    start: startID,
                    target: -1
                })
            }).done(data => {
                resolve(data);
                console.log(data);
                if (data !== "200") {
                    if (data === "400") {
                        console.log(data);
                        console.log("Unallowed turn");
                    } else {
                        console.log("An error occured");
                    }
                } else {
                    console.log("data " + data);
                    place(startField, player);
                    endPlayersTurn();
                }
            }).fail(function () {
                console.log("Cant perform turn");
            });
        });

    } else {
        let targetID = parseInt($(targetField).attr("id").slice(5, 7));
        $.ajax({
            type: 'POST',
            url: '/turn',
            data: JSON.stringify({
                start: startField,
                target: targetID
            })
        }).done(data => {
            if (data === 200) {
                move(startField, targetField, player);
                endPlayersTurn();
            } else if (data === 400) {
                console.log("Unallowed turn");
            }
        }).fail(function () {
            console.log("Cant perform turn");
        });
    }
}

function endPlayersTurn() {
    return new Promise(resolve => {
        $.get("/end").done(data => {
            resolve(data);
        }).fail(function () {
            console.log("Cant end the turn");
        });
    });
}

function loadPlayer() {
    return new Promise(resolve => {
        $.get("/player").done(data => {
            resolve(data);
        }).fail(function () {
            console.log("Cant load player - Start the game first");
            resolve(undefined);
        });
    });
}

$(document).ready(function () {
    connectWebSocket();
    $('.field').click(async function () {
        let startField = $(this);
        let player = await loadPlayer();
        if (player !== undefined) {
            console.log("Current Player: " + player.player);
            if (player.phase === "Place") {
                await performTurn(startField, undefined, player)
            } else if (player.phase === "Move" || player.phase === "Fly") {
                $('.field').click(function () {
                    let targetField = $(this);
                    performTurn(startField, targetField, player);
                })
            }
            $('#currentPlayer').text(player.player);
        } else {
            console.log("Player is undefiend - Start the game");
        }
    });
});