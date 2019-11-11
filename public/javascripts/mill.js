function place(field) {
    field.attr("xlink:href", "#white");
}

function move(field1, field2) {
    field1.attr("fill", "white");
    field2.attr("fill", "black")
}

function fly(field1, field2) {
    field1.attr("fill", "white");
    field2.attr("fill", "black")

}

$(document).ready(function () {
    $('.field').click(function () {
        console.log($(this).attr("id"));
        place($(this));
    });
});