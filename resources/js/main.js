const circle = document.querySelector('.container')
let canMove = true

/* angle in degrees by which circle is rotated; start at 75deg */
let currentAngle = 75

const majorKeyLabels = Array.from(
  document.querySelectorAll('.major_keys ul li')
)
const minorKeyLabels = Array.from(
  document.querySelectorAll('.minor_keys ul li')
)
const staffSections = Array.from(
  document.querySelectorAll('.staff ul li')
)

majorKeyLabels.forEach(label => {
  label.addEventListener(
    'click', e => rotateToKey(e.target.parentElement)
  )
})
minorKeyLabels.forEach(label => {
  label.addEventListener(
    'click', e => rotateToKey(e.target.parentElement)
  )
})
staffSections.forEach(section => {
  section.addEventListener(
    'click', e => rotateToKey(e.target.parentElement)
  )
})

/* map each section of the circle to the angle by which it is displaced
 * from the center top-most position */
const angleMapping = new Map()
let angle = 0

for (let i = 0; i < 12; i++) {
  angleMapping.set(i, angle)
  angle += 30
}

function rotateToKey (selectedLabel) {
  const selectedIndex = Number(selectedLabel.dataset.index)
  const localAngle = angleMapping.get(selectedIndex)

  /* the circle should rotate no more than 180deg to center the
     * selected key, so -180 < turnAngle <= 180 */
  let turnAngle = 360 - localAngle
  if (turnAngle > 180) {
    turnAngle -= 360
  } else if (turnAngle <= -180) {
    turnAngle += 360
  }

  rotateCircle(turnAngle)
}

function rotateCircle (turnAngle) {
  const newAngle = currentAngle + turnAngle
  currentAngle = newAngle

  circle.style.transition = `transform ${Math.abs(turnAngle) / 60}s ease-out`
  circle.style.transform = `rotate(${newAngle}deg)`

  updateAngleMapping(turnAngle)
}

// update angle mapping
function updateAngleMapping (turnAngle) {
  angleMapping.forEach((angle, index) => {
    let newAngle = angle + turnAngle
    /* 0 <= local angles < 360 */
    if (newAngle >= 360) {
      newAngle -= 360
    } else if (newAngle < 0) {
      newAngle += 360
    }
    angleMapping.set(index, newAngle)
  })
}

document.onkeydown = e => {
  if (!canMove) {
    return false
  }
  canMove = false

  if (e.code === 'ArrowRight') {
    rotateCircle(30)
  } else if (e.code === 'ArrowLeft') {
    rotateCircle(-30)
  }
  setTimeout(function () { canMove = true }, 200)
}
