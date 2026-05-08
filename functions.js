//all DOM elements from index.html
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
const cDaysDisplay = document.querySelectorAll('.day');
const weekDisplay = document.getElementById("week-display");
const colorChoice = document.getElementById("color-choice");
const colorPicker = document.getElementById("color-picker");
const colorOkButton = document.getElementById("color-ok-button");

// create calendar variables
const cdi = new Date();  // cdi = current date information
const cYear = cdi.getFullYear();
const cMonthNum = cdi.getMonth() + 1;
const cDate = cdi.getDate();
// used to find the proper week-day of the first day of the year (since every year doesn't start on a monday)
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

let cWeekDates = [];  // array for saving the dates of the week

// checks for leap year
function checkLeapYear(checkLYear) {
    return (checkLYear % 4) === 0;
}

//name the month
function getMonthName(monthNum) {
    if (monthNum === 1) {
        return "January";
    } else if (monthNum === 2) {
        return "February";
    } else if (monthNum === 3) {
        return "March";
    } else if (monthNum === 4) {
        return "April";
    } else if (monthNum === 5) {
        return "May";
    } else if (monthNum === 6) {
        return "June";
    } else if (monthNum === 7) {
        return "July";
    } else if (monthNum === 8) {
        return "August";
    } else if (monthNum === 9) {
        return "September";
    } else if (monthNum === 10) {
        return "October";
    } else if (monthNum === 11) {
        return "November";
    } else if (monthNum === 12) {
        return "December";
    }
}

// prep code for the data needed in multiple functions
let totalDays = 0;
let cMonthDays = 0;
let previousMonth = ['', 0, 0];
let nextMonth = ['', 0, 0];

// useful funciton calculate totalDays, previousMonth (name and days) and nextMonth (name and days)
function calData(givenDate, givenMonth, givenYear) {
    totalDays = 0;
    cMonthDays = 0;
    previousMonth = ['', 0, 0];
    nextMonth = ['', 0, 0];
    let leapYear = checkLeapYear(givenYear);

    for (let i = 1; i <= givenMonth; i++) { //goes through (i + 1) amount of months and adds up total amount of days
        if (i === 1) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['December', 31, 12];
            if (leapYear) {
                nextMonth = ['February', 29, 2];
            } else {
                nextMonth = ['February', 28, 2];
            }
        } else if (i === 2) {
            nextMonth = ['March', 31, 3];
            previousMonth = ['January', 31, 1];
            // checks if it's a leap year
            if (leapYear) {
                if (i < givenMonth) {
                    totalDays += 29;
                } else {
                    totalDays += givenDate;
                }
                cMonthDays = 29;
            } else {
                if (i < givenMonth) {
                    totalDays += 28;
                } else {
                    totalDays += givenDate;
                }
                cMonthDays = 28;
            }
        } else if (i === 3) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            nextMonth = ['April', 30, 4];
            // checks if it's a leap year
            if (leapYear) {
                previousMonth = ['February', 29, 2];
            } else {
                previousMonth = ['February', 28, 2];
            }
        } else if (i === 4) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['March', 31, 3];
            nextMonth = ['May', 31, 5];
        } else if (i === 5) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['April', 30, 4];
            nextMonth = ['June', 30, 6];
        } else if (i === 6) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['May', 31, 5];
            nextMonth = ['July', 31, 7];
        } else if (i === 7) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['June', 30, 6];
            nextMonth = ['August', 31, 8]
        } else if (i === 8) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['July', 31, 7];
            nextMonth = ['September', 30, 9];
        } else if (i === 9) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['August', 31, 8];
            nextMonth = ['October', 31, 10];
        } else if (i === 10) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['September', 30, 9];
            nextMonth = ['November', 30, 11];
        } else if (i === 11) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['October', 31, 10];
            nextMonth = ['December', 31, 12];
        } else if (i === 12) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            previousMonth = ['November', 30, 11];
            nextMonth = ['January', 31, 1];
            cMonthDays = 31;
        }
    }
}

// useful for arrow functions for finding previousMonth, nextMonth etc.
function monthData(givenDate, givenMonth, givenYear) {
    totalDays = 0;
    cMonthDays = 0;
    previousMonth = ['', 0, 0];  // [Monthname, monthdays, monthnum]
    nextMonth = ['', 0, 0];      // [Monthname, monthdays, monthnum]
    let leapYear = checkLeapYear(givenYear);

    for (let i = 1; i <= givenMonth; i++) { //goes through (i + 1) amount of months and adds up total amount of days
        if (i === 1) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['December', 31, 12];
            if (leapYear) {
                nextMonth = ['February', 29, 2];
            } else {
                nextMonth = ['February', 28, 2];
            }
        } else if (i === 2) {
            nextMonth = ['March', 31, 3];
            previousMonth = ['January', 31, 1];
            // checks if it's a leap year
            if (leapYear) {
                if (i < givenMonth) {
                    totalDays += 29;
                } else {
                    totalDays += givenDate;
                }
                cMonthDays = 29;
            } else {
                if (i < givenMonth) {
                    totalDays += 28;
                } else {
                    totalDays += givenDate;
                }
                cMonthDays = 28;
            }
        } else if (i === 3) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            nextMonth = ['April', 30, 4];
            // checks if it's a leap year
            if (leapYear) {
                previousMonth = ['February', 29, 2];
            } else {
                previousMonth = ['February', 28, 2];
            }
        } else if (i === 4) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['March', 31, 3];
            nextMonth = ['May', 31, 5];
        } else if (i === 5) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['April', 30, 4];
            nextMonth = ['June', 30, 6];
        } else if (i === 6) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['May', 31, 5];
            nextMonth = ['July', 31, 7];
        } else if (i === 7) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['June', 30, 6];
            nextMonth = ['August', 31, 8]
        } else if (i === 8) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['July', 31, 7];
            nextMonth = ['September', 30, 9];
        } else if (i === 9) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['August', 31, 8];
            nextMonth = ['October', 31, 10];
        } else if (i === 10) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['September', 30, 9];
            nextMonth = ['November', 30, 11];
        } else if (i === 11) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['October', 31, 10];
            nextMonth = ['December', 31, 12];
        } else if (i === 12) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            previousMonth = ['November', 30, 11];
            nextMonth = ['January', 31, 1];
            cMonthDays = 31;
        }
    }

    return [previousMonth, nextMonth, cMonthDays];
}

// function finds the week of the given date info and displays it in the week title on the webpage and also returns the entire week dates in an array
function displayWeek(given_Date, given_Month, given_Year) {
    // CODE THAT DISPLAYS THE WEEK TITLE
    // gets multiple needed values; cMonthDays, previousMonth, nextMonth, totalDays 
    calData(given_Date, given_Month, given_Year);
    let givenMonthName = getMonthName(given_Month);

    // calculates current day of the week as a number, 0 is monday, 6 is sunday
    let cDayInWeekNum = (totalDays + firstDayDatabase[given_Year]) % 7;
    if (cDayInWeekNum === 0) { // it's a sunday
        cDayInWeekNum = 6;
    } else { 
        cDayInWeekNum -= 1; 
    }
    
    let cWeek = findWeek(given_Date, given_Month, given_Year);

    // code to calculate this weeks monday and this weeks sunday, and display the dates after
    let cWeekMondayDate;
    let cWeekSundayDate;

    // calculate monday and sunday dates, and display them in the week title
    // NB: cDayInWeekNum goes from 0-6!!
    // checks if the entire week is within this month only
    if (given_Date > cDayInWeekNum && (given_Date + 6 - cDayInWeekNum) <= cMonthDays) {
        cWeekMondayDate = given_Date - cDayInWeekNum;
        cWeekSundayDate = cWeekMondayDate + 6;
        weekDisplay.textContent = `Week ${cWeek}, ${cWeekMondayDate} - ${cWeekSundayDate} ${givenMonthName}, ${given_Year}`;
    // checks if the week starts in the previous month 
    } else if (given_Date <= cDayInWeekNum) {
        cWeekMondayDate = previousMonth[1] + given_Date - cDayInWeekNum;
        cWeekSundayDate = given_Date + 6 - cDayInWeekNum;
        weekDisplay.textContent = `Week ${cWeek}, ${cWeekMondayDate} ${previousMonth[0]}- ${cWeekSundayDate} ${givenMonthName}, ${given_Year}`;
    // checks if the week ends in the next month
    } else if (cMonthDays < (given_Date + 6 - cDayInWeekNum)) {
        cWeekMondayDate = given_Date - cDayInWeekNum;
        cWeekSundayDate = cWeekMondayDate - cMonthDays + 6;
        weekDisplay.textContent = `Week ${cWeek}, ${cWeekMondayDate}. ${givenMonthName} - ${cWeekSundayDate}. ${nextMonth[0]}, ${given_Year}`;
    }

    // CODE THAT DISPLAYS THE SEPARATE WEEK DATES
    let dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    findWeekDates(given_Date, given_Month, given_Year);  // !! Important to assign cDate , cMonth, cYear for every switch in calendar placement for them to then be placed as parameters inside of the DisplayWeek function.
    cDaysDisplay.forEach((el, i) => el.textContent = `${dayNames[i]}. ${cWeekDates[i]}`);
    
}

//creation of info data about the event (to then save in the calendar database)
function findDate() {
    calData(cDate, cMonthNum, cYear);  //get totaldays etc.
    // calculates current day of the week as a number, 0 is sunday, 6 is saturday
    let cDayInWeekNum = (totalDays + firstDayDatabase[cYear]) % 7;
    // adjusts the cdayinweek to go from 0-6 (instead of 1-7)
    if (cDayInWeekNum === 0) { // it's a sunday
        cDayInWeekNum = 6;
    } else { 
        cDayInWeekNum -= 1; 
    }

    let diff = chooseDay.value - cDayInWeekNum;  //chooseDay is the input on the site (from main: script.js)
    let foundDate;
    let foundMonth;
    let foundYear = cYear;
    if (cDate + diff <= 0) {
        foundDate = previousMonth[1] + cDate + diff;
        foundMonth = previousMonth[2];
        // checks if the previous month was december
        if (previousMonth[2] === 12) {
            foundYear -= 1;
        }
    } else if (cDate + diff > cMonthDays) {
        foundDate = (cDate + diff) - cMonthDays;
        foundMonth = nextMonth[2];
        // checks if the next month is january
        if (nextMonth[2] === 1) {
            foundYear += 1;
        }
    } else {
        foundDate = cDate + diff;
        foundMonth = cMonthNum;
    }

    return `${foundDate}/${foundMonth}/${foundYear}`;
}

// function to find the dates for every day of the week of the given date
function findWeekDates(given__Date, given__Month, given__Year) {
    cWeekDates = [];

    // variable for sending the month of the first day of the week (needed for the sameWeek function, for comparing the month of the weeks correclty)
    let firstDayMonth;

    // gets multiple needed values; cMonthDays, previousMonth, nextMonth, totalDays 
    calData(given__Date, given__Month, given__Year);

    // calculates current day of the week as a number, 0 is monday, 6 is sunday
    let cDayInWeekNum = (totalDays + firstDayDatabase[given__Year]) % 7;
    if (cDayInWeekNum === 0) { // it's a sunday
        cDayInWeekNum = 6;
    } else { 
        cDayInWeekNum -= 1; 
    }

    // code to calculate this weeks monday and this weeks sunday, and display the dates after
    let cWeekMondayDate;

    //calculate monday and sunday dates, and display them in the week title
    if (given__Date > cDayInWeekNum && (given__Date + 6 - cDayInWeekNum) <= cMonthDays) {
        // runs if the given__Date's week start and end are within the current month
        cWeekMondayDate = given__Date - cDayInWeekNum;
        // saves the month num of monday
        firstDayMonth = given__Month; 
    } else if (given__Date <= cDayInWeekNum) {
        // runs if the start of the given__Date's week is in the previous month
        cWeekMondayDate = previousMonth[1] + given__Date - cDayInWeekNum;
        cMonthDays = previousMonth[1];
        // saves the month num of monday
        firstDayMonth = previousMonth[2];
    } else if (cMonthDays < (given__Date + 6 - cDayInWeekNum)) {
        // runs if the given__Date's week is within the next month
        cWeekMondayDate = given__Date - cDayInWeekNum;
        // saves the month num of monday
        firstDayMonth = nextMonth[2];
    }

    cWeekDates.push(cWeekMondayDate);
    let offsetNM = 0;  // offset value needed if a date or multiple dates of the week are in the next month
    for (let i = 1; i < 7; i++) {
        if (cWeekMondayDate + i <= cMonthDays) {
            cWeekDates.push(cWeekMondayDate + i);
        } else {
            offsetNM += 1;
            cWeekDates.push(offsetNM);
        }
    }

    // Pushes the 8th element of cWeekDates as the monthnum of the monday
    cWeekDates.push(firstDayMonth);
    
    return cWeekDates;
}

// function to find the week number of a given date
function findWeek(givenDate, givenMonth, givenYear) {
    totalDays = 0;
    cMonthDays = 0;
    previousMonth = ['', 0, 0];
    nextMonth = ['', 0, 0];
    let leapYear = checkLeapYear(givenYear);

    for (let i = 1; i <= givenMonth; i++) { //goes through (i + 1) amount of months and adds up total amount of days
        if (i === 1) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['December', 31, 12];
            if (leapYear) {
                nextMonth = ['February', 29, 2];
            } else {
                nextMonth = ['February', 28, 2];
            }
        } else if (i === 2) {
            nextMonth = ['March', 31, 3];
            previousMonth = ['January', 31, 1];
            // checks if it's a leap year
            if (leapYear) {
                if (i < givenMonth) {
                    totalDays += 29;
                } else {
                    totalDays += givenDate;
                }
                cMonthDays = 29;
            } else {
                if (i < givenMonth) {
                    totalDays += 28;
                } else {
                    totalDays += givenDate;
                }
                cMonthDays = 28;
            }
        } else if (i === 3) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            nextMonth = ['April', 30, 4];
            // checks if it's a leap year
            if (leapYear) {
                previousMonth = ['February', 29, 2];
            } else {
                previousMonth = ['February', 28, 2];
            }
        } else if (i === 4) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['March', 31, 3];
            nextMonth = ['May', 31, 5];
        } else if (i === 5) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['April', 30, 4];
            nextMonth = ['June', 30, 6];
        } else if (i === 6) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['May', 31, 5];
            nextMonth = ['July', 31, 7];
        } else if (i === 7) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['June', 30, 6];
            nextMonth = ['August', 31, 8]
        } else if (i === 8) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['July', 31, 7];
            nextMonth = ['September', 30, 9];
        } else if (i === 9) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['August', 31, 8];
            nextMonth = ['October', 31, 10];
        } else if (i === 10) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 31;
            previousMonth = ['September', 30, 9];
            nextMonth = ['November', 30, 11];
        } else if (i === 11) {
            if (i < givenMonth) {
                totalDays += 30;
            } else {
                totalDays += givenDate;
            }
            cMonthDays = 30;
            previousMonth = ['October', 31, 10];
            nextMonth = ['December', 31, 12];
        } else if (i === 12) {
            if (i < givenMonth) {
                totalDays += 31;
            } else {
                totalDays += givenDate;
            }
            previousMonth = ['November', 30, 11];
            nextMonth = ['January', 31, 1];
            cMonthDays = 31;
        }
    }

    // totaldays - 1 to get the first day of the year to be 0, + the first day of the year(0 if monday, 6 if sunday) divide by 7 and + 1 for offset since math.floor.
    return Math.floor(((totalDays - 1 + firstDayDatabase[givenYear]) / 7) + 1);
}

// used for finding the date of a given week
function findRanWeekDay(givenWeek, givenYear) {
    totalDays = 0;
    totalDays = firstDayDatabase[givenYear] + 7*givenWeek;
    
}

// function to check if two dates are in the same week
function sameWeek(date1, date2) {
    // gets the week (s) of the first and second date through two functions: extractFromDate to convert the '23/10/2006' to each separate integer needed, then displayWeek to get the weekdate arrays
    let compWeek1 = findWeekDates(extractFromDate("date", date1), extractFromDate("month", date1), extractFromDate("year", date1));
    let compWeek2 = findWeekDates(extractFromDate("date", date2), extractFromDate("month", date2), extractFromDate("year", date2));

    // returns the result 
    let comparison = true;
    for (let i = 0; i < 7; i++) {

        // comparison false if any of the following is false: week date not matching, months not matching, years not matching
        if (compWeek1[i] !== compWeek2[i] || compWeek1[7] !== compWeek2[7] || extractFromDate("year", date1) !== extractFromDate("year", date2)) {
            comparison = false;
        }
    }
    return comparison;
}

// function to extract the number from a date (date, month, year)
function extractFromDate(extractionType, extDate) {
    let extraction = false;
    let extractedDate = "";
    let extractedMonth = "";
    let extractedYear = "";

    // extract date
    let i = 0;
    while (!extraction) {
        if (extDate[i] === "/") {
            extraction = true;
        } else {
            extractedDate += extDate[i];
        }
        i++;
    }

    while (extraction) {
        if (extDate[i] === "/") {
            extraction = false;
        } else {
            extractedMonth += extDate[i];
        }
        i++;
    } 

    while (extDate[i]) {
        extractedYear += extDate[i];
        i++;
    }

    if (extractionType === "date") {
        return parseInt(extractedDate);
    } else if (extractionType === "month") {
        return parseInt(extractedMonth);
    } else if (extractionType === "year") {
        return parseInt(extractedYear);
    }
}

// finds the day in the week of a date and returns as an int: 0-6
function findDayInWeek(givenDate, givenMonth, givenYear) {
    calData(givenDate, givenMonth, givenYear);
    // if it's a sunday the % will give 0, so adjusted through this if
    if (((totalDays + firstDayDatabase[givenYear]) % 7) === 0) {
        return 6;
    } else {
        return ((totalDays + firstDayDatabase[givenYear]) % 7 - 1);
    }
}

// checks if event overlaps a currently existing one and returns boolean. Takes a time: 'from --> to' ,a date: 'Day/Month/Year', and the object containing saved data
function eventOverlap( givenTime, givenFullDate, givenData ) {
    let overlap = false;
    for (let i = 0; i < givenData.eventNum; i++) {
        let eventNName = `event${i + 1}`;  // event num name
        // checks if the dates are equal
        if (givenData.all_events[eventNName].date === givenFullDate) {
            // gets start- and end-time for the given date
            let start1 =  Number(givenTime.match(/\d+/)[0]);
            let end1 = Number(givenTime.match(/\d+(?!.*\d)/)[0]);

            // gets start- and end-time for the data
            let start2 = Number((givenData.all_events[eventNName].time).match(/\d+/)[0]);
            let end2 = Number((givenData.all_events[eventNName].time).match(/\d+(?!.*\d)/)[0]);

            if ((start1 <= start2 && end1 > start2) || (start1 >= start2 && start1 < end2)) {
                overlap = true;
            }
        }
    }

    return overlap;
}

export { checkLeapYear, getMonthName, calData, monthData, displayWeek, findDate, findWeekDates, findWeek, findRanWeekDay, sameWeek, extractFromDate, findDayInWeek, eventOverlap };