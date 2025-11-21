const displayNone = (el) => $(el).css("display", "none")
const displayFlex = (el) => $(el).css("display", "flex")

const titleMatching = $("#swapper-title-matching")
const titleDrag = $("#swapper-title-drag")

const formExternal = $("#external-events")
const formMatching = $("#match-event")

$(titleMatching).on("click", function () {
    $(this).addClass("swapper-activ")
    $(titleDrag).removeClass("swapper-activ")

    displayFlex(formMatching)
    displayNone(formExternal)
})

$(titleDrag).on("click", function () {
    $(this).addClass("swapper-activ")
    $(titleMatching).removeClass("swapper-activ")

    displayFlex(formExternal)
    displayNone(formMatching)
})
