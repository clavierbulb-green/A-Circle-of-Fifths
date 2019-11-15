const circle = document.querySelector('.container');

/* angle in degrees by which circle is rotated; start at 75deg */
let current_angle = 75;


let major_key_labels = Array.from(document.querySelectorAll('.major ul li'));
let minor_key_labels = Array.from(document.querySelectorAll('.minor ul li'));

major_key_labels.forEach(label => {
    label.addEventListener("click", e => rotate_circle(e.target.parentElement))
});
minor_key_labels.forEach(label => {
    label.addEventListener("click", e => rotate_circle(e.target.parentElement))
});


/* map each section of the circle to the angle by which it is displaced
 * from the center top-most position */
let angle_mapping = new Map(); 
let angle = 0;

for (let i = 0; i < 12; i++) {
    angle_mapping.set(i, angle);
    angle += 30;
}

function rotate_circle(selected_label) {
    let selected_index = Number(selected_label.dataset.index);
    let local_angle = angle_mapping.get(selected_index);
    let angle_to_turn = 360 - local_angle;
    if (angle_to_turn > 180) {
        angle_to_turn -= 360;
    }
    else if(angle_to_turn <= -180) {
        angle_to_turn += 360;
    }
    let new_angle = current_angle + angle_to_turn;
    current_angle = new_angle;

    //update angle mapping
    angle_mapping.forEach((angle, index) => {
        let new_angle = angle + angle_to_turn;
        if (new_angle >= 360) {
            new_angle -= 360;
        }
        else if (new_angle <= -360) {
            new_angle += 360;
        }
        angle_mapping.set(index, new_angle); 
    });

    circle.style.transition = `transform ${Math.abs(angle_to_turn)/60}s ease-out`;
    circle.style.transform = `rotate(${new_angle}deg)`;
}
