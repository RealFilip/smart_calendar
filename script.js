
// imports multiple functions 
import { checkLeapYear, getMonthName, calData, monthData, displayWeek, findDate, findWeekDates, findWeek, sameWeek, extractFromDate, findDayInWeek, eventOverlap } from './functions.js';

//EVERYTHING CALENDAR RELATED
// get all calendar document objects
const weekDisplay = document.getElementById("week-display");
const dayDisplay = document.querySelectorAll(".day");

// create calendar variables
const cdi = new Date();  // cdi = current date information
let cYear = cdi.getFullYear();
let cMonthNum = cdi.getMonth() + 1;
let cDate = cdi.getDate();
const firstDayDatabase = {
    2025: 2,
    2026: 3,
    2027: 4,
    2028: 5,
    2029: 0,
    2030: 1,
    2031: 2,
    2032: 3,
    2033: 5,
    2034: 6,
    2035: 0,
    2036: 2,
    2037: 3,
    2038: 4,
    2039: 5,
    2040: 0,
    2041: 1,
    2042: 2,
    2043: 3,
    2044: 5,
    2045: 6,
    2046: 0,
    2047: 1,
    2048: 3,
    2049: 4,
    2050: 5,
}

// finds the current week number (needed for arrows to jump between weeks)
let cWeek = findWeek(cDate, cMonthNum, cYear);

// add event to calendar
const addEventBtn = document.getElementById("add-event");
const calPannel = document.getElementById("calendar-pannel");
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

// arrows
const previousWeek = document.getElementById("week-before");
const nextWeek = document.getElementById("week-after");

addEventBtn.addEventListener("click", () => {
    calPannel.style.display = 'none';
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

//creating a new event to the current week
createEventBtn.addEventListener("click", () => {
    // CODE TO CHECK IF GIVEN INFO BY USER IS VALID
    
    let errorMessage = "Error: ";
    let error = false;
    let missingCounter = 0;
    let eventHeight;

    //checks if the chosen time period is legitimate
    if (parseInt(chooseFrom.value) >= parseInt(chooseTo.value)) {
        error = true;
        errorMessage += "time space chosen not valid"
    }

    //checks if a group has been assigned / chosen
    if (!groupInput.value) {
        if (error === true) {
            errorMessage += ", ";
        }
        error = true;
        errorMessage += "missing group"
        missingCounter += 1;
    }

    //checks if the description is added
    if (!descInput.value) {
        if (missingCounter === 1) {
            errorMessage += "and description";
            error = true;
        } else {
            if (error === true) {
                errorMessage += ", ";
            }
            error = true;
            errorMessage += "missing description";
        }
    }

    // checks if the new event overlaps an already existing event in the database
    if (eventOverlap(`${chooseFrom.value} --> ${chooseTo.value}`, findDate(), calendarData)) {
        if (error === true) {
            errorMessage += ", ";
        }
        error = true;
        errorMessage += "chosen space of time collides with an existing event";
    }

    //error message gets sent if errors have been found
    if (error) {
        errorEventCreation.textContent = errorMessage;
        errorEventCreation.style.display = 'inline-block';
    } else {
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
        calendarData.eventNum += 1;
        const eventName = `event${calendarData.eventNum}`;

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

// LOAD IN DATA
// function that loops through each saved group and checks if any saved events are in the current week
function displayEvents (gDate, gMonthNum, gYear) {
    for (let i = 0; i < calendarData.groups.groupNames.length; i++) {
        // assigns all events of the i-th group
        let getGroupName = calendarData.groups.groupNames[i];
        let groupEvents = calendarData.groups[getGroupName].events;

        // loop to go through every event in the i-th group
        for (let y = 0; y < groupEvents.length; y++) {
            let groupEvent = groupEvents[y];
            let eventDate = calendarData.all_events[groupEvent].date;

            //extract just date, just month, just year
            let eventDay = extractFromDate("date", eventDate);
            let eventMonth = extractFromDate("month", eventDate);
            let eventYear = extractFromDate("year", eventDate);

            //check if the date is in the current week
            if (sameWeek(`${eventDay}/${eventMonth}/${eventYear}`, `${gDate}/${gMonthNum}/${gYear}`)) {
                let newEvent = document.createElement('p');
                newEvent.classList.add("new-event");
                addEventBtn.style.display = 'block';
                newEvent.style.backgroundColor = calendarData.groups[getGroupName].color;
                newEvent.textContent = calendarData.all_events[groupEvent].desc;

                //calculation of event coordinates in the calendar grid
                let fTN = Number((calendarData.all_events[groupEvent].time).match(/\d+/)[0]);         // from time num
                let tTN = Number((calendarData.all_events[groupEvent].time).match(/\d+(?!.*\d)/)[0]); // to time num
                let deltaTN = tTN - fTN;

                newEvent.style.marginLeft = `${findDayInWeek(eventDay, eventMonth, eventYear) * 6 + 1}rem`;
                newEvent.style.marginTop = `${fTN}rem`;
                newEvent.style.height = `${deltaTN}rem`;
                grid.appendChild(newEvent);
            }
        }
    }
}

// function that hides all displayed events
function hideEvents () {
    let newEvents = document.querySelectorAll(".new-event");
    newEvents.forEach(el => { el.style.display = 'none' });
}

let calendarData = {};  //predefines the main data variable 
// finds saved data or starts from scratch if none found
if (!localStorage.getItem("sm-calendar-data")) {
    calendarData = {
        // totalt amount of events
        eventNum: 1,
        
        // groups object for the different groups created by the user
        groups: {
            groupNames: ["sport"],

            sport: {
                color: "orange",
                events: ["event1"]
            }
        },

        // events object to systematically create event objects that then get added into their adherent group
        all_events: {
            event1: {
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

displayWeek(cDate, cMonthNum, cYear); //gets week dates

// loads existing data
displayEvents(cDate, cMonthNum, cYear);



// CALENDAR NAVIGATION
//arrow left (previous week)
previousWeek.addEventListener("click", () => {
    // array with the data of the previous month [monthName, monthDays, monthNum]
    const prevMonth = monthData(cDate, cMonthNum, cYear)[0];

    // adjusts the cDate/cMonthNum/cYear accordingly
    if ((cDate - 7) > 0 ) {
        cDate -= 7;
    } else if (cDate - 7 <= 0) {
        // checks if the previous month was december and adjusts the year if it's the case
        if (prevMonth[2] === 12) {
            cYear -= 1;
        }
        // adjusts the month
        cMonthNum = prevMonth[2];
        
        // adjusts the date to the previousmonth days number + current date - a week
        cDate = prevMonth[1] + cDate - 7;
    }

    // hides events from previous week
    hideEvents();

    // loads in current events
    displayEvents(cDate, cMonthNum, cYear);

    // displays new week
    displayWeek(cDate, cMonthNum, cYear);
})

//arrow right (next week)
nextWeek.addEventListener("click", () => {
    // array with the data of the next month [monthName, monthDays, monthNum]
    const nextMonth = monthData(cDate, cMonthNum, cYear)[1];
    // array with the number of the current month days
    const cMonth = monthData(cDate, cMonthNum, cYear)[2];

    // adjusts the cDate/cMonthNum/cYear accordingly
    if ((cDate + 7) <= cMonth ) {
        cDate += 7;
    } else if (cDate + 7 > cMonth) {
        // checks if the next month is january and adjusts the year if it's the case
        if (nextMonth[2] === 1) {
            cYear += 1;
        }
        // adjusts the month
        cMonthNum = nextMonth[2];
        
        // adjusts the date to the nextmonth days number - current date + a week
        cDate = cDate - cMonth + 7;
    }

    // hides events from previous week
    hideEvents();

    // loads in current events
    displayEvents(cDate, cMonthNum, cYear);

    // displays new week
    displayWeek(cDate, cMonthNum, cYear);
});