
// sort title
let sort_title = document.getElementById("title");

// number boxes
let number_boxes = document.getElementsByClassName("number-box");

// all numbers
let numbers = document.getElementsByClassName("number");

// sort (start) button
let sort_button = document.getElementById("sort-button");

// all input fields
let inputs = document.getElementsByClassName("input-field");

// type buttons
let bubble_sort_button = document.getElementById("button1");
let selection_sort_button = document.getElementById("button2");

// movement animations (the index 10 and 11 were found by printing the cssRules and checking what index the Keyframes of the animation were in)
let animation1 = document.styleSheets[0].cssRules[10];
let animation2 = document.styleSheets[0].cssRules[11];

// sets the mode to "bubble" as "bubble" is the default mode
let sort_mode = "bubble";


function isNumeric(value) { //checks if a given string is numeric or not
    return /^-?\d+$/.test(value);
}

function check_inputs(){ // check if all input fields have valid values in them when sort_button is clicked
    for(let i = 0; i < inputs.length; i++){
        let current_input = inputs[i];
        let input_value = current_input.value;

        if (input_value == "" || !isNumeric(input_value) || parseInt(input_value) > 999999){
            return false;
        }
    }
    return true;
}
function apply_inputs(){ // applies the value of the input fields onto the numbers
    for(let i = 0; i < inputs.length; i++){
        let input = inputs[i];
        let number = numbers[i];

        number.innerHTML = input.value;
    }
}


function create_list(){ // creates a list of numbers from the numbers object list
    let number_list = [];
    for(let i = 0; i < numbers.length; i++){
        let current_num = numbers[i];
        number_list.push(parseInt(current_num.innerHTML));
    }
    return number_list;
}
function log_arr(arr){ // used for logging arrays in order to see and test values (this isnt used in the code and is just for testing)
    for (let i = 0; i < arr.length; i++){
        console.log(arr[i]);
    }
}


function change_box_color(box){ // changes the given boxes color to the red value of the program
    box.style.borderColor = "rgb(209, 19, 47)";
    box.style.backgroundColor = "rgb(209, 19, 47)";
    box.style.boxShadow = "0px 0px 20px 7px rgb(209, 19, 47)"
}
function reset_colors(index){ // resets the colors of all boxes
    for(let i = index; i < number_boxes.length; i++){
        let box = number_boxes[i];
        box.style.borderColor = "rgb(26, 143, 232)";
        box.style.backgroundColor = "rgb(26, 143, 232)";
        box.style.boxShadow = "0px 0px 20px 7px rgb(26, 143, 232)"
    }
}


async function bubble_sort(arr){ // uses bubble sort to sort the given array
    while (true){
        let switched = false;

        for(let i = 0; i < arr.length - 1; i++){
            // get all relevant things
            let first_num = arr[i];
            let second_num = arr[i + 1];
            let first_box = number_boxes[i];
            let second_box = number_boxes[i + 1];
            let first_number = numbers[i];
            let second_number = numbers[i + 1];

            // change box colors
            change_box_color(first_box);
            change_box_color(second_box);

            // bubble sort check
            if (first_num > second_num){
                if(!switched){
                    switched = true;
                }
                let temp = first_num;
                arr[i] = second_num;
                arr[i + 1] = temp;


                // start the animation (750ms long)
                first_box.classList.add('sort2');
                second_box.classList.add('sort1');

                // end the animation after waiting 750ms
                setTimeout(() => {
                    first_box.classList.remove('sort2');
                    second_box.classList.remove('sort1');
                }, 750);

                await sleep(0.75); // wait 750ms before going to the next 2 numbers

                                // switch the numbers in the number boxes
                let temp2 = first_number.innerHTML;
                first_number.innerHTML = second_number.innerHTML;
                second_number.innerHTML = temp2;
            }
            reset_colors(0); // resets the colors after every check
        }
        if (!switched){ // if no numbers were switched, exit the loop
            break;
        }
    }
}
async function selection_sort(arr){ // does selection sort on a given array
    for (let i = 0; i < arr.length; i++){
        // grabs all of the first number data
        let first_number = arr[i];
        let first_num = numbers[i];
        let first_box = number_boxes[i];

        // sets all required variables
        let minimum_number = first_number;
        let minimum_num;
        let minimum_box;
        let minimum_index = i;

        // colors the first box
        change_box_color(first_box);

        // runs from i+1 to the end of array
        for(let j = i + 1; j < arr.length; j++){
            // sets all the required variables
            let second_number = arr[j];
            let second_box = number_boxes[j];
            change_box_color(second_box) // changes second boxes color
            if (second_number < minimum_number){ // checks if the current number is smaller then the minimum
                // sets new minimum data to the current data
                minimum_number = second_number; 
                minimum_num = numbers[j];
                minimum_box = second_box;
                minimum_index = j;
            }

            await sleep(0.75); // sleeps for 0.75 seconds
            reset_colors(j); // resets all colors from index j up to the end of the array
        }

        if (minimum_number != first_number){ // checks if a switch needs to take place

            // switches the numbers in the array itself
            arr[i] = minimum_number;
            arr[minimum_index] = first_number;

            // calculate distance the number_boxes need to travel in order to switch positions with one another
            let space = minimum_index - i;
            let pixels = 90 * (space);

            // change animation distance to calculated distance
            animation2.appendRule("100% { transform: translateX(" + pixels + "px); }");
            animation1.appendRule("100% { transform: translateX(-" + pixels + "px); }");

            //change minimum_box color
            change_box_color(minimum_box);

            // start the animation (750ms long)
            first_box.classList.add('sort2');
            minimum_box.classList.add('sort1');

            // end the animation after waiting 750ms
            setTimeout(() => {
                first_box.classList.remove('sort2');
                minimum_box.classList.remove('sort1');
                animation1.deleteRule("100%");
                animation2.deleteRule("100%");
            }, 750);


            await sleep(0.75);

            // switch the numbers on the number boxes
            let temp = first_num.innerHTML;
            first_num.innerHTML = minimum_num.innerHTML;
            minimum_num.innerHTML = temp;
        }
        reset_colors(0);
    }
}

async function sleep(seconds){ // acts as a sleep function by multiplying a given number of milliseconds and multiplying by 1000 to make into seconds
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

bubble_sort_button.onclick = function(){ // changes mode to "bubble" when clicked
    sort_title.innerHTML = "Bubble Sort";
    sort_mode = "bubble";
}
selection_sort_button.onclick = function(){ // changes mode to "selection" when clicked
    sort_title.innerHTML = "Selection Sort";
    sort_mode = "selection";
}
sort_button.onclick = function(){ // gets called when the sort button is clicked

    input_check = check_inputs(); // checks for valid inputs
    
    if (input_check){ 
        apply_inputs(); // applies the valid inputs into the number boxes
        number_list = create_list(); // gets the returned list of numbers

        if (sort_mode == "bubble"){
            animation1.deleteRule("100%");
            animation1.appendRule("100% { transform: translateX(-90px); }");

            animation2.deleteRule("100%");
            animation2.appendRule("100% { transform: translateX(90px); }");

            bubble_sort(number_list); // initiates the bubble sort        
        }
        else if(sort_mode == "selection"){
            animation1.deleteRule("100%");
            animation2.deleteRule("100%");
            selection_sort(number_list);
        }
    }
}