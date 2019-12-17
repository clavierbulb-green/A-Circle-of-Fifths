/* maps each section of the circle to the angle by which it is displaced
 * from the center top-most position */
const AngleMapping = numSections => {
  const map = new Map();
  const init = () => {
    let angle = 0;
    for (let i = 0; i < numSections; i++) {
      map.set(i, angle);
      angle += 360 / numSections;
    }
  };
  const update = turnAngle => {
    map.forEach((angle, i) => {
      let newAngle = angle + turnAngle;
      /* 0 <= local angles < 360 */
      if (newAngle >= 360) {
        newAngle -= 360;
      } else if (newAngle < 0) {
        newAngle += 360;
      }
      map.set(i, newAngle);
    });
  };

  return {
    map,
    init,
    update
  };
};

const Circle = (c, numSections, startAngle) => {
  const angleMapping = AngleMapping(numSections);
  angleMapping.init();

  const rotate = angle => {
    const newAngle = Number(c.dataset.angle) + angle;
    c.style.transform = `rotate(${newAngle + startAngle}deg)`;
    c.style.transition = `transform ${Math.abs(angle) / 60}s ease-in-out`;
    angleMapping.update(angle);
    c.dataset.angle = newAngle; /* TODO ensure data -180 <= angle <= 180 */
  };

  /* rotate circle to center the section at the given index */
  const center = index => {
    const localAngle = angleMapping.map.get(index);

    /* the circle should rotate no more than 180deg to center the
     * selected key, so -180 < turnAngle <= 180 */
    let turnAngle = 360 - localAngle;
    if (turnAngle > 180) {
      turnAngle -= 360;
    } else if (turnAngle <= -180) {
      turnAngle += 360;
    }
    rotate(turnAngle);
  };

  return {
    rotate,
    center
  };
};

/* globals */
const NUM_KEYS = 12;
const START_ANGLE = -75;

const circleOfFifths = Circle(
  document.querySelector(".cof"),
  NUM_KEYS,
  START_ANGLE
);

const majorKeys = Array.from(document.querySelectorAll(".major li"));
const minorKeys = Array.from(document.querySelectorAll(".minor li"));
const staffSections = Array.from(document.querySelectorAll(".staff li"));

const rings = [majorKeys, minorKeys, staffSections];

rings.forEach(ring => {
  ring.forEach(section => {
    section.addEventListener("click", e =>
      circleOfFifths.center(ring.indexOf(section))
    );
  });
});
