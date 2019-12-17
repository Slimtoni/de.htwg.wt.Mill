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


async function updateField(field) {
    getFieldStatus(field).done(data => {
        console.log(data.fieldStatus);
        if (data.fieldStatus === "White") {
            field.attr("xlink:href", "#white");
        } else if (data.fieldStatus === "Black") {
            field.attr("xlink:href", "#black");
        } else {
            field.attr("xlink:href", "#empty");
        }
    }).fail(error => {
        console.log("Error")
    });
    //console.log("Change fieldStatus to " + ajax.data.fieldStatus);

}

function getBoard() {
    return new Promise(resolve => {
        $.get("/board").done(data => {
            resolve(data);
        }).fail(function () {
            console.log("Cant load board");
            resolve(undefined);
        });
    });
}


async function killMan(field) {
    //field.attr("xlink:href", "#empty");
    await getFieldStatus(field);
    //currentFieldStatus = "Empty";
    updateField(field)
}


function getFieldStatus(field) {
    let fieldID = parseInt($(field).attr("id").slice(5, 7));
    return $.ajax({
        type: 'POST',
        url: '/getField',
        data: JSON.stringify({
            field: fieldID
        })
    })
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
                    updateField(startField)
                    endPlayersTurn();
                }
            }).fail(function () {
                console.log("Cant perform turn");
            });
        });*/
        getBoard();
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

function caseOfMill(field) {
    let fieldID = parseInt($(field).attr("id").slice(5, 7));
    $.ajax({
        type: 'POST',
        url: '/caseOfMill',
        data: JSON.stringify({
            field: fieldID
        })
    }).done(data => {
        console.log("Received caseOfMill status: " + data);
        if (data === "200") {
            foundMill = true;
            killMan(field)
        } else {
            console.log(data)
        }
    }).fail(function () {
        console.log("Failed caseOfMill function");
        resolve(undefined);
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


async function connectWebSocket() {

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

    websocket.onmessage = async function (event) {
        if (typeof event.data === "string") {
            console.log("dataJS: " + event.data);
            if (event.data !== "200") {
                if (event.data === "400") {
                    console.log(event);
                    console.log("Unallowed turn");
                } else {
                    console.log("An error occured");
                }
            } else {
                console.log(event);
                await updateField(startField);

                endPlayersTurn();
            }
        }
    }
}

$(document).ready(function () {

    var app = new Vue({
        el: '#mill-app',
        render: function (html) {
            return html(MillApp.default, {});
        }

    })
    connectWebSocket();
    getBoard();
    $('.field').click(async function () {

        startField = $(this);
        player = await loadPlayer();
        if (player !== undefined) {

            /*console.log("Clicked Field: " + startField + " - Current Player: " + player.player +
                "Found Mill status: " + foundMill);*/

            if (!foundMill) {
                if (player.phase === "Place") {
                    await performTurn(startField, undefined, player);
                    await updateField(startField);
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
            } else {
                caseOfMill(startField);
                updateField(startField);
            }
            $('#currentPlayer').text(player.player);
        } else {
            console.log("Player is undefiend - Start the game");
        }
    });
});