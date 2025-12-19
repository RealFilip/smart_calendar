
// imports multiple functions 
import { checkLeapYear, getMonthName, calData, displayWeek, findDate, findWeekDates, sameWeek, extractFromDate } from './functions.js';

//EVERYTHING CALENDAR RELATED
// get all calendar document objects
const weekDisplay = document.getElementById("week-display");
const dayDisplay = document.querySelectorAll(".day");

// create calendar variables
const cdi = new Date();  // cdi = current date information
const cYear = cdi.getFullYear();
const cMonthNum = cdi.getMonth() + 1;
const cDate = cdi.getDate();
const firstDayDatabase = {
    2025: 2,
    2026: 3,
    2027: 4,
    2028: 5,
    2029: 0,
    2030: 1
}

//calculate the current week
let totalDays = 0;
let cMonthDays = 0;
let previousMonth = ['', 0, 0];
let nextMonth = ['', 0, 0];

// add event to calendar
const addEventBtn = document.getElementById("add-event");
const eventDesc = document.querySelectorAll(".event-desc");
const createEventBtn = document.getElementById("create-event");
const groupInput = document.getElementById("group");
const descInput = document.getElementById("desc");
const chooseDay = document.getElementById("choose-day");
const chooseFrom = document.getElementById("choose-from");
const chooseTo = document.getElementById("choose-to");
const errorEventCreation = document.getElementById("error-event-creation");
const grid = document.querySelector('.grid');
const colorChoice = document.getElementById("color-choice");
const colorPicker = document.getElementById("color-picker");
const colorOkButton = document.getElementById("color-ok-button");

addEventBtn.addEventListener("click", () => {
    addEventBtn.style.display = 'none';
    eventDesc.forEach(el => { el.style.display = 'grid' });
})

let timeDifference; // variable used to determine how much the user can write for the description as well as the visible length of the event
descInput.addEventListener("input", () => {
    timeDifference = parseInt(chooseTo.value) - parseInt(chooseFrom.value);
    descInput.maxLength = timeDifference * 19;

    // checks if letter limit is reached and sends error code to inform user
    if (descInput.value.length === timeDifference * 19) {
        let infoMessage = "NOTE: max description limit reached. Tip: you can choose a longer lasting event for more typing space.";
        errorEventCreation.textContent = infoMessage;
        errorEventCreation.style.display = 'inline-block';
    }
})

// coordinates for the new event in the calendar grid.
let xEvent;
let yEvent;

createEventBtn.addEventListener("click", () => {
    // CODE TO CHECK IF GIVEN INFO BY USER IS VALID
    
    let errorMessage = "Error: ";
    let error = false;
    let missingCounter = 0;
    let eventHeight;

    //checks if the chosen time period is legitimate
    if (parseInt(chooseFrom.value) >= parseInt(chooseTo.value)) {
        error = true;
        errorMessage += "time space chosen not valid, "
    }

    //checks if a group has been assigned / chosen
    if (!groupInput.value) {
        error = true;
        errorMessage += "missing group"
        missingCounter += 1;
    }

    //checks if the description is added
    if (!descInput.value) {
        error = true;
        if (missingCounter === 1) {
            errorMessage += " and description";
        } else {
            errorMessage += "missing description";
        }
    }

    //error message gets sent if errors have been found
    if (error) {
        errorEventCreation.textContent = errorMessage;
        errorEventCreation.style.display = 'inline-block';
    } else {
        console.log(calendarData);
        //calculation of event coordinates in the calendar grid
        xEvent = chooseDay.value * 6 + 1;
        yEvent = chooseFrom.value;
        eventHeight = chooseTo.value - chooseFrom.value;


        // CHECKS IF THE GROUP ASSIGNED IS NEW
        let groupIsNew = true;
        let color = "lightblue";  //this needs to be changed to the color from the database (based on the group of the event)
        for (const key in calendarData.groups) {
            if (key === groupInput.value) {
                groupIsNew = false;
                color = calendarData.groups[key].color;
            }
        }

        // CODE FOR HIDING THE EVENT CREATION AND PUTTING BACK THE "ADD EVENT" BUTTON
        eventDesc.forEach(el => { el.style.display = 'none' });
        errorEventCreation.style.display = 'none';

        // CODE FOR THE CREATION OF THE EVENT

        let newEvent = document.createElement('p');
        newEvent.classList.add("new-event");

        // updates amount of events, and creates the event name (eventx, for x amount of total events)
        calendarData.all_events.num += 1;
        const eventName = `event${calendarData.all_events.num}`;

        // if the group assigned is new, the user gets to choose its color
        if (groupIsNew) {
            colorChoice.style.display = 'grid';

            // adds the new group to the groupName array that keeps track of all group names ( needed for the for loop to load in the data )
            calendarData.groups.groupNames.push(groupInput.value);
            
            colorOkButton.addEventListener("click", () => {
                // saves the chosen color, removes the color-choice div and shows the add event button
                color = colorPicker.value;
                colorChoice.style.display = 'none';
                addEventBtn.style.display = 'block';

                // adds the chosen color and adds the new group to the calendar database
                newEvent.style.backgroundColor = color;

                calendarData.all_events[eventName] = {
                    date: findDate(),
                    time: `${chooseFrom.value} --> ${chooseTo.value}`,
                    desc: descInput.value
                }

                calendarData.groups[groupInput.value] = {
                    color: color,
                    events: [eventName]
                }

            }, {once: true}); // makes sure that this event listener for the specific element gets deactivated after one use, to avoid color confusion (all elements adapting the new color chosen)
        } else {
            addEventBtn.style.display = 'block';
            newEvent.style.backgroundColor = color;
            //adds new event data to the already existing group
            calendarData.all_events[eventName] = {
                date: findDate(),
                time: `${chooseFrom.value} --> ${chooseTo.value}`,
                desc: descInput.value
            }

            calendarData.groups[groupInput.value].events.push(eventName);
        }

        newEvent.textContent = descInput.value;
        newEvent.style.marginLeft = `${xEvent}rem`;
        newEvent.style.marginTop = `${yEvent}rem`;
        newEvent.style.height = `${eventHeight}rem`;
        grid.appendChild(newEvent);

        localStorage.setItem("sm-calendar-data", JSON.stringify(calendarData));
    }

})

// calendar navigation


// LOAD IN DATA
let calendarData = {};  //predefines the main data variable 
// finds saved data or starts from scratch if none found
if (!localStorage.getItem("sm-calendar-data")) {
    calendarData = {
        // groups object for the different groups created by the user
        groups: {
            groupNames: ["sport"],

            sport: {
                color: "orange",
                events: ["basketball"]
            }
        },

        // events object to systematically create event objects that then get added into their adherent group
        all_events: {
            num: 1,

            basketball: {
                    date: "13/12/2025",
                    time: `1 --> 3`,
                    desc: "Play basketball"
            }
        }
    };
    localStorage.setItem("sm-calendar-data", JSON.stringify(calendarData));
} else {
    calendarData = JSON.parse(localStorage.getItem("sm-calendar-data"));
}
// loads in saved data if existing
for (let i = 0; i < calendarData.all_events.num; i++) {} 

displayWeek(cDate, cMonthNum, cYear); //gets week dates

for (let i = 0; i < calendarData.groups.groupNames.length; i++) {
    // assigns all events of the i-th group
    let getGroupName = calendarData.groups.groupNames[i];
    let groupEvents = calendarData.groups[getGroupName].events;
    let groupColor = calendarData.groups[calendarData.groups.groupNames[i]].color;

    // loop to go through every event in the i-th group
    for (let y = 0; y < groupEvents.length; y++) {
        let groupEvent = groupEvents[y];
        let eventDate = calendarData.all_events[groupEvent].date;

        //extract just date, just month, just year
        let eventDay = extractFromDate("date", eventDate);
        let eventMonth = extractFromDate("month", eventDate);
        let eventYear = extractFromDate("year", eventDate);

        console.log(`${eventDay}, ${eventMonth}, ${eventYear}`);
        
        //check if the date is in the current week
        if (sameWeek(`${eventDay}/${eventMonth}/${eventYear}`, cDate)) {
            //if yes display the saved data to the current week
        }
    }
}

