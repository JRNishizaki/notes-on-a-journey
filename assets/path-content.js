// timestamps for all segments
const timestamps = [
  0,
  9,
  33,
  45,
  57,
  69,   // 1:09
  100,  // 1:40
  111,  // 1:51
  129,  // 2:09
  140,  // 2:20
  152,  // 2:32
  169,  // 2:49
  175,  // 2:55
  191,  // 3:11
  203,  // 3:23
  253,  // 4:13
  259,  // 4:19
  281,  // 4:40, end
];

// define globals for which section was last visible
var prevTimeSegment = null;

// Given "time" in seconds, return the segment # in which the time falls
function getSegment (time) {
  let segmentNum = timestamps.findIndex(timestamp => timestamp > time) - 1;
  return segmentNum
}

// Given "time" in seconds, return the percent progress along the matching segment
function getSegmentProgress (time) {
  let currentSegment = getSegment(time);
  let segmentStart = timestamps[currentSegment];
  let segmentEnd = timestamps[currentSegment + 1];
  let progress = (time - segmentStart) / (segmentEnd - segmentStart);
  return progress
}

// position the marker along the line
// update the segment class to show position
function updateSVG (time) {
  // console.log(`updateSVG(): SVG is updating (${time})`)
  let segment = getSegment(time); //which segment
  let segmentProgress = getSegmentProgress(time); //% progress of segment

  let segmentMove = document.getElementsByClassName("segment");
  let segmentLength = segmentMove[segment].getTotalLength();

  let lilDot = document.getElementById("youAreHereDot");
  let colorfulDots = document.getElementsByClassName("dot");

  // make sure that all previous segments have class "visited"
  // make sure that all future segments don't have class "visited"
  // also added a bit where if you went back to an earlier segment, it would get rid of progress of where you were
  for (i = 0; i < segmentMove.length; i++) {
    if (i <= segment) {
      segmentMove[i].classList.add("visited");
      segmentMove[i].style.strokeDasharray = segmentMove[i].getTotalLength;
      segmentMove[i].style.strokeDashoffset = 0;
    } else {
      segmentMove[i].classList.remove("visited");
      segmentMove[i].style.strokeDasharray = "100%";
      segmentMove[i].style.strokeDashoffset = "100%";
    }
  }
  //idk if this is the right was to do this, but add a class to just the selected segment, remove it if it isn't
  segmentMove[segment].classList.add("youarehere");
  colorfulDots[segment].classList.add("highlightTemp");
  for (i = 0; i < segmentMove.length; i++) {
    if (i < segment || i > segment) {
      segmentMove[i].classList.remove("youarehere");
      colorfulDots[i].classList.remove("highlightTemp");
    }
  }

  // make current segment partially visible (based on segment progress)
  let dotPosition = segmentProgress * segmentLength;

  segmentMove[segment].style.strokeDasharray = segmentLength;
  segmentMove[segment].style.strokeDashoffset = segmentLength - segmentProgress * segmentLength;

  // get position along current segment
  let point = segmentMove[segment].getPointAtLength(dotPosition);

  // position marker at appropriate (x,y) coordinates
  //it took me way too long to realize that x and y were refered to as cx and cy cause it's a circle. i hate this.
  lilDot.setAttribute("cx", point.x);
  lilDot.setAttribute("cy", point.y);

  let daisies = document.getElementById("daisies");
  let blueL = document.getElementById("blueOverlayL");
  let blueR = document.getElementById("blueOverlayR");
  let slicey = document.getElementById("sliceySlicey");
  let birdYellow = document.getElementById("yellowBird");

  if (segment == 15) {  
    let daisyTime = (time - 253) * 16.67;
    let blueTimeL = (((time - 253) * 75) - 450);
    let blueTimeR = (500 - ((time-253) * 83.33));

    daisies.style.display = "block";
    daisies.style.opacity = daisyTime;

    blueL.style.display = "block";
    blueL.style.transform = "translate(" + blueTimeL + "px,0px)";

    blueR.style.display = "block";
    blueR.style.transform = "translate(" + blueTimeR + "px,0px)";

  } else {
    daisies.style.display = "none";
    daisies.style.opacity = "0";

    blueL.style.transform = "translate(-450px,0px)";

    blueR.style.transform = "translate(500px,0px)";
  }

  if (time >= 259) {
    slicey.style.transform = "translate(0px,355px)";
    birdYellow.style.display = "none";

  } else {
    slicey.style.transform = "translate(0px,0px)";
    birdYellow.style.display = "block";
  }
}

// make the appropriate text for the segment visible
function updateText (segment) {
  // console.log(`updateText(): text is updating (${segment})`)
  // identify the current section
  let textArea = document.getElementById("text");
  let desiredSection = document.querySelector(`#text > :nth-child(${segment + 1})`);
  // identify all other sections
  let otherSections = document.querySelectorAll(`#text > :not(:nth-child(${segment + 1}))`);

  desiredSection.style.display = "block";

  if (segment >= 1) {
    desiredSection.style.backgroundColor = "rgba(243, 235, 223, .9)";
    desiredSection.style.padding = "1em 3.5em 1em 1.5em";
  };

  otherSections.forEach(s => s.style.display = "none");

}

function updateView () {
  // get video progress
  let video = document.querySelector("#marchVideo");

  let isPlaying = (!video.paused && !video.ended) || video.seeking;

  // update view

  // define what happens when page first loads and video is paused
  if (prevTimeSegment == null) {
    updateSVG(0);
    updateText(0);
    prevTimeSegment = 0;

  // if the video is currently playing, update SVG and text (if needed)
  } else if (isPlaying) {
    // console.log(`video is paused/sinking/ended: ${video.paused} / ${video.seeking} / ${video.ended}`)
    let time = video.currentTime;
    let segment = getSegment(time); //progress on segment

    updateSVG(time);

    // only update text if the current segment is different than prev segment
    if (segment != prevTimeSegment) {
      updateText(segment);
    }
    prevTimeSegment = segment;
  }

  setTimeout(updateView, 30); // delay is defined in milliseconds
}

function togglePlay() {
  let video = document.querySelector("#marchVideo");
  if (video.paused || video.ended) {
        video.play();
    } else {
        video.pause();
      }
    }

  var squiggle = document.getElementById("squiggle");
  var squiggleBack = document.getElementById("squiggleBackground");
  squiggle.addEventListener("click", togglePlay);
  squiggleBack.addEventListener("click", togglePlay);

//when you hover on a location marker it'll show the text for that segment and if you click on the location marker it'll jump there ahhh do i do this with an eventlistener for mouseover and out?

function mouseOverEffect() {
  this.classList.add("highlight");
}

function mouseOutEffect() {
  this.classList.remove("highlight");
}

function jumpToTime(dotSegmentNum) {
  //trying to get this to work currently
  //I want to find the position of the dot clicked, and then find the corresponding segment
  //make current time = timestamps[segment]

  let video = document.querySelector("#marchVideo");
  video.currentTime = timestamps[dotSegmentNum];
}

// set timeout so that function doesn't update too quickly
// call updateView()
function main () {

  // link text and svg visuals to the video
  updateView();

  // add event listeners to dots to update video position on click
  let colorfulDots = document.getElementsByClassName("dot");
  for (let i = 0; i < colorfulDots.length; i++) {
    colorfulDots[i].addEventListener('mouseover', mouseOverEffect);
    colorfulDots[i].addEventListener('mouseout', mouseOutEffect);
    // colorfulDots[i].addEventListener('mouseover', function() {hoverText(i)});
    // colorfulDots[i].addEventListener('mouseout', updateText);
    colorfulDots[i].addEventListener('click', function() {jumpToTime(i)});
  }
}

let lastKnownScrollPosition = 0;
let agh = document.body.offsetHeight - window.innerHeight;
let screaming = 0;

let bird2 = document.getElementById('bird2');
let bird2Rote = 0;
let bird3 = document.getElementById('bird3');
let bird3Rote = 0;
let bird7 = document.getElementById('bird7');
let bird7Rote = 0;

function hopeThisWorks(percentScroll) {
  // console.log(percentScroll); 
  if (percentScroll >= 0.075 && percentScroll <= 0.175) {
    bird2Rote = 110 - (((percentScroll - 0.075))*2200);
    bird2.style.transform = 'rotate(' + bird2Rote + 'deg)';
  }
  if (percentScroll >= 0.225 && percentScroll <= 0.325) {
    bird3Rote = -110 + (((percentScroll - 0.225))*2200);
    bird3.style.transform = 'rotate(' + bird3Rote + 'deg)';
  }
  if (percentScroll >= 0.375 && percentScroll <= 0.475) {
  bird7Rote = 110 - (((percentScroll - 0.375))*2200);
  bird7.style.transform = 'rotate(' + bird7Rote + 'deg)';
  }
}
document.addEventListener("scroll", (event) => {
  lastKnownScrollPosition = window.pageYOffset;
  screaming = lastKnownScrollPosition / agh;
  hopeThisWorks(screaming);
});

var pop = document.querySelector('.popUp');
var backCont = document.querySelector('.container');

function closeButton() {
  pop.style.display = "none";
  backCont.style.display = "none";
}

function doThings() {
  pop.style.display = "block";
  backCont.style.display = "block";
}

document.querySelector("#close").addEventListener('click', closeButton);
// var pop = document.getElementsByClassName('.popUp');
function popUpAppear() {
  // console.log('help');
  setTimeout(         
      doThings,
      1000 
    )
}
  window.addEventListener("load", popUpAppear);

main();
