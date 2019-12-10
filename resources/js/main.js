const circle = document.querySelector('.container');
let can_move = true;

/* angle in degrees by which circle is rotated; start at 75deg */
let current_angle = 75;


let major_key_labels = Array.from(
    document.querySelectorAll('.major_keys ul li')
);
let minor_key_labels = Array.from(
    document.querySelectorAll('.minor_keys ul li')
);
let staff_sections = Array.from(
    document.querySelectorAll('.staff ul li')
);

major_key_labels.forEach(label => {
    label.addEventListener(
        "click", e => rotate_to_key(e.target.parentElement)
    )
});
minor_key_labels.forEach(label => {
    label.addEventListener(
        "click", e => rotate_to_key(e.target.parentElement)
    )
});
staff_sections.forEach(section => {
    section.addEventListener(
        "click", e => rotate_to_key(e.target.parentElement)
    )
});


/* map each section of the circle to the angle by which it is displaced
 * from the center top-most position */
let angle_mapping = new Map(); 
let angle = 0;

for (let i = 0; i < 12; i++) {
    angle_mapping.set(i, angle);
    angle += 30;
}

function rotate_to_key(selected_label) {
    let selected_index = Number(selected_label.dataset.index);
    let local_angle = angle_mapping.get(selected_index);

    /* the circle should rotate no more than 180deg to center the 
     * selected key, so -180 < turn_angle <= 180 */
    let turn_angle = 360 - local_angle;
    if (turn_angle > 180) {
        turn_angle -= 360;
    }
    else if(turn_angle <= -180) {
        turn_angle += 360;
    }

    rotate_circle(turn_angle);
}

function rotate_circle(turn_angle) {
    let new_angle = current_angle + turn_angle;
    current_angle = new_angle;

    circle.style.transition = `transform ${Math.abs(turn_angle)/60}s ease-out`;
    circle.style.transform = `rotate(${new_angle}deg)`;

    update_angle_mapping(turn_angle);
}


//update angle mapping
function update_angle_mapping(turn_angle) {
    angle_mapping.forEach((angle, index) => {
        let new_angle = angle + turn_angle;
        /* 0 <= local angles < 360 */
        if (new_angle >= 360) {
            new_angle -= 360;
        }
        else if (new_angle < 0) {
            new_angle += 360;
        }
        angle_mapping.set(index, new_angle); 
    });
}

document.onkeydown = e => {
    if (!can_move) {
        return false;
    }
    can_move = false;

    if (e.code === 'ArrowRight') {
        rotate_circle(30);
    }
    else if (e.code === 'ArrowLeft') {
        rotate_circle(-30)
    }
    setTimeout(() => can_move = true, 200);
}
