function copyToClipboard(element) {
    var $temp = $("<h2>");
    $(".roomID").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

const add = document.querySelector(".add");
add.addEventListener("click", () => {

})