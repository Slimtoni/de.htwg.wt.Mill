let csrf = $('input[name="csrfToken"]').attr("name");
let foundMill = false;



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

async function updateField(field) {
    getFieldStatus(field).done(data => {
        console.log(data.fieldStatus)
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
                console.log(data)
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

function checkMill(field) {
    let fieldID = parseInt($(field).attr("id").slice(5, 7));
    return new Promise( resolve => {
        $.ajax({
            type: 'POST',
            url: '/checkMill',
            data: JSON.stringify({
                field: fieldID
            })
        }).done(data => {
            console.log("Received checkMill status: " + data)
            if (data === "true") {
                foundMill = true
            } else if (data === "false") {
                foundMill = false
            }
        }).fail( function () {
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
        console.log("Received caseOfMill status: " + data)
        if (data === "200") {
            foundMill = true
            killMan(field)
        } else {
            console.log(data)
        }
    }).fail( function () {
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

$(document).ready(function () {
    connectWebSocket();
    $('.field').click(async function () {
        let startField = $(this);
        let player = await loadPlayer();
        if (player !== undefined) {
            console.log("Clicked Field: " + startField + " - Current Player: " + player.player +
                            " - Found Mill status: " + foundMill);
            if (!foundMill) {
                if (player.phase === "Place") {
                    await performTurn(startField, undefined, player);
                    await checkMill(startField);
                    if(!foundMill) {
                        endPlayersTurn()
                    }
                } else if (player.phase === "Move" || player.phase === "Fly") {
                    $('.field').click(function () {
                        let targetField = $(this);
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