function place(field, player) {
    if (player === "White"){
        field.attr("xlink:href", "#white");
    } else if (player==="Black"){
        field.attr("xlink:href", "#black");
    }
}

function move(field1, field2, player) {
    if (player === "Black") {
        field1.attr("xlink:href", "#empty");
        field2.attr("xlink:href", "#black");
    } else if (player === "White"){
        field1.attr("xlink:href", "#empty");
        field2.attr("xlink:href", "#white");
    }
}

function fly(field1, field2, player) {
    if (player === "Black") {
        field1.attr("xlink:href", "#empty");
        field2.attr("xlink:href", "#black");
    } else if (player === "White"){
        field1.attr("xlink:href", "#empty");
        field2.attr("xlink:href", "#white");
    }

}

function loadPlayer() {
    return new Promise(resolve => {
        $.get("/player").done(data => {
            resolve(data);
        });
    });

}

function changePlayer(){
    $.get("turn")
}

$(document).ready(function () {
    $('.field').click(async function () {
        let player = await loadPlayer();
        console.log(player);
        console.log($(this).attr("id"));
        if (player.phase === "Place"){
            place($(this), player.player)
        } else if (player.phase === "Move"){
            move($(this), player.player)
        } else if (player.phase === "Fly"){
            fly($(this), player.player)
        }
        changePlayer()

    });
});