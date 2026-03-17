let positionArrowLeft = 0;
let directionArrow = 0.45;// vitesse de déplacement

function arrowBouncing() {
    positionArrowLeft += directionArrow;
    if (positionArrowLeft > 10 || positionArrowLeft < 0) { //range max
        directionArrow *= -1;
    }
    $("#arrow-boucing-left").css("transform", `translateX(${positionArrowLeft}px)`);
    $("#arrow-boucing-right").css("transform", `translateX(${-positionArrowLeft}px) rotate(180deg)`);
    requestAnimationFrame(arrowBouncing);
}


let positionCardFloating = 0;
let directionCardFloating = 0.22; //vitesse de déplacement
function animateFloatingCard() {
    positionCardFloating += directionCardFloating;
    if (positionCardFloating > 15 || positionCardFloating < 0) { //range max
        directionCardFloating *= -1;
    }
    $(".card-hero-floating").css("transform", `translateY(${positionCardFloating}px)`)
    requestAnimationFrame(animateFloatingCard)
}

requestAnimationFrame(arrowBouncing);
requestAnimationFrame(animateFloatingCard)

