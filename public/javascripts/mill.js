let csrf = $('input[name="csrfToken"]').attr("name");

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': csrf,
        'Content-Type': 'application/json',
        //'Accept': 'application/json'
    }
});

function place(field, player) {
    console.log("Player: " + player.player)
    if (player.player === "White") {
        console.log("place White Stone!")
        field.attr("xlink:href", "#white");
    } else if (player.player === "Black") {
        console.log("place Black Stone!")
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
                    }
                } else {
                    console.log("data " + data);
                    place(startField, player);
                }
            }).fail(function () {
                console.log("fail");
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
            } else if (data === 400) {
                console.log("Unallowed turn");
            }
        });
    }
}

function loadPlayer() {
    return new Promise(resolve => {
        $.get("/player").done(data => {
            resolve(data);
        });
    });

}

$(document).ready(function () {
    $('.field').click(async function () {
        let startField = $(this);
        let player = await loadPlayer();
        if (player.phase === "Place") {
            await performTurn(startField,undefined, player)
        } else if (player.phase === "Move" || player.phase === "Fly") {
            $('.field').click(function () {
                let targetField = $(this);
                performTurn(startField, targetField, player);
            })
        }
        $('#currentPlayer').text(player.player);

    });
});