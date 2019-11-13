let csrf = $('input[name="csrfToken"]').attr("name");

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': csrf,
        'Content-Type': 'application/json',
        //'Accept': 'application/json'
    }
});

function place(field, player) {
    if (player === "White") {
        field.attr("xlink:href", "#white");
    } else if (player === "Black") {
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

function fly(field1, field2, player) {
    if (player === "Black") {
        field1.attr("xlink:href", "#empty");
        field2.attr("xlink:href", "#black");
    } else if (player === "White") {
        field1.attr("xlink:href", "#empty");
        field2.attr("xlink:href", "#white");
    }

}

function performTurn(startField, targetField) {
    if (targetField === undefined) {
        $.ajax({
            type: 'POST',
            url: '/turn',
            data: JSON.stringify({
                start: startField,
                target: -1
            })
        }).done(data => {
           console.log(data);
        });
    } else {
        $.post("/turn", startField, targetField)
    }
}

function loadPlayer() {
    return new Promise(resolve => {
        $.get("/player").done(data => {
            resolve(data);
        });
    });

}

function changePlayer() {
    $.get("turn")
}

$(document).ready(function () {
    $('.field').click(async function () {
        let startField = $(this);
        let player = await loadPlayer();
        console.log(player);
        console.log($(this).attr("id"));
        if (player.phase === "Place") {
            performTurn(startField)
        } else if (player.phase === "Move" || player.phase === "Fly") {
            $('.field').click(function () {
                performTurn(startField, $(this))
            })
        }

        $('#currentPlayer').text(player.player);

    });
});