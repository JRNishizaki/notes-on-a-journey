function togglePlay() {
      if (video1.paused || video1.ended) {
        video1.play();
      } else {
        video1.pause();
      }
    }

function videoProgress() {
        var videoPercentage = (video1.currentTime / video1.duration);
        document.getElementById("agh").style.strokeDashoffset = pathLength - videoPercentage * pathLength;
        // console.log(progressPercentage);
    }

function popUpAppear() {
  // console.log('help');
  setTimeout(
        function open(event){
            var pop = document.getElementsByClassName('popUp');
            pop.style.display = "block";
        },
        1000 
    )
}

function main() {
  var colorfulDots = document.getElementsByClassName('cls-2');
  var seeBlurb = document.getElementsByClassName('blurb');
 // var path = document.querySelector('.squiggleMove');


  for (var i = 0; i < colorfulDots.length; i++) {
    colorfulDots[i].addEventListener('mouseover', mouseOverEffect);
    colorfulDots[i].addEventListener('mouseout', mouseOutEffect);
  }
   var agh = document.getElementById("agh");
    // console.log(agh);
  var pathLength = agh.getTotalLength();
    // console.log(pathLength);
  var video1 = document.getElementById("marchVideo");
  var squiggle = document.getElementsByClassName("squiggleMove");

  video1.addEventListener("timeupdate", videoProgress);
    squiggle.addEventListener("click", togglePlay);

  
  }



document.addEventListener('DOMContentLoaded', popUpAppear);

 main();   