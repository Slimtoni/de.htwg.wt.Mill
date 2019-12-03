let csrf = $('input[name="csrfToken"]').attr("name");
let foundMill = false;
let websocket = new WebSocket("ws://localhost:9000/websocket");
let startField;
let targetField;
let player;

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': csrf,
        'Content-Type': 'application/json',
        //'Accept': 'application/json'
    }
});


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
        websocket.send(JSON.stringify({
            start: startID,
            target: -1
        }));
        /*return new Promise(resolve => {
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
                if (checkMill(startField)) {
                    //alert("Mill");
                } else {
                    //alert("No Mill")
                }

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
        });*/
    } else {
        let targetID = parseInt($(targetField).attr("id").slice(5, 7));
        websocket.send(JSON.stringify({
            start: startField,
            target: targetID
        }));
        /*
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

         */
    }


}

function checkMill(field) {
    let fieldID = parseInt($(field).attr("id").slice(5, 7));
    return new Promise(resolve => {
        $.ajax({
            type: 'POST',
            url: '/checkMill',
            data: JSON.stringify({
                field: fieldID
            })
        }).done(data => {
            //console.log("Received checkMill status: " + data);
            if (data === "true") {
                foundMill = true
            } else if (data === "false") {
                foundMill = false
            }
        }).fail(function () {
            console.log("Failed to check Mill");
            resolve(undefined);
        })
    })
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



function connectWebSocket() {

    websocket.setTimeout;

    websocket.onopen = function () {
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
            console.log("dataJS: " + event.data);
            if (event.data !== "200") {
                if (event.data === "400") {
                    console.log(event.data);
                    console.log("Unallowed turn");
                } else {
                    console.log("An error occured");
                }
            } else {
                console.log("data " + event.data);
                place(startField, player);
                endPlayersTurn();
            }
        }
    }
}

$(document).ready(function () {
    connectWebSocket();
    $('.field').click(async function () {

        startField = $(this);
        player = await loadPlayer();
        if (player !== undefined) {
            /*console.log("Clicked Field: " + startField + " - Current Player: " + player.player +
                "Found Mill status: " + foundMill);*/
            if (!foundMill) {
                if (player.phase === "Place") {
                    await performTurn(startField, undefined, player);
                    await checkMill(startField);
                    if (!foundMill) {
                        endPlayersTurn()
                    }
                } else if (player.phase === "Move" || player.phase === "Fly") {
                    $('.field').click(function () {
                        targetField = $(this);
                        performTurn(startField, targetField, player);
                    })
                }
                $('#currentPlayer').text(player.player);
            }
            $('#currentPlayer').text(player.player);
        } else {
            console.log("Player is undefiend - Start the game");
        }
    });
});