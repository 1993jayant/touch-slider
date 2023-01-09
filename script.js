const slider = document.querySelector(".slider-container")
const slides = Array.from(document.querySelectorAll(".slide"))

let isDragging = false
let startPos = 0
let currentTranslate = 0
let prevTranslate = 0
let animationId = 0
let currentIndex = 0

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector("img")
  slideImage.addEventListener("dragstart", (e) => {
    e.preventDefault()
  })

  //   touch events
  slide.addEventListener("touchstart", touchStart(index))
  slide.addEventListener("touchend", touchEnd)
  slide.addEventListener("touchmove", touchMove)

  //   click events
  slide.addEventListener("mousedown", touchStart(index))
  slide.addEventListener("mouseup", touchEnd)
  slide.addEventListener("mouseleave", touchEnd)
  slide.addEventListener("mousemove", touchMove)
})

// disable right click options
window.oncontextmenu = function (e) {
  e.preventDefault()
  e.stopPropagation()
  return false
}

function touchStart(index) {
  return function (event) {
    currentIndex = index
    // starting position of the drag
    startPos = getPositionX(event)
    isDragging = true

    animationId = requestAnimationFrame(animation)
    slider.classList.add("grabbing")
  }
}

function touchEnd() {
  isDragging = false
  cancelAnimationFrame(animationId)

  const movedBy = currentTranslate - prevTranslate

  // move to next slide
  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1
  }

  // move to previous slide
  if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1
  }

  setPositionByIndex()

  slider.classList.remove("grabbing")
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event)
    currentTranslate = prevTranslate + currentPosition - startPos
  }
}

// return the position(x-coordinate) of the mouse or touch
function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX
}

// animation loop to paint the new document/page/screen
function animation() {
  setSliderPosition()
  if (isDragging) requestAnimationFrame(animation)
}

// set the transform property of image container
function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`
}

function setPositionByIndex() {
  // setting the position of the image to the center
  currentTranslate = currentIndex * -window.innerWidth

  // setting the previous translate to center of the screen
  prevTranslate = currentTranslate

  // moving the image to the translate value
  setSliderPosition()
}
