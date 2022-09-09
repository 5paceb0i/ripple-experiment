const date = document.querySelector(".date");
const time = document.querySelector(".time");

let sysDate = new Date();
const dateValue = sysDate.getDate();
const monthValue = sysDate.getMonth() + 1;
const yearValue = sysDate.getFullYear();

const displayDate = `${dateValue}${monthValue}${yearValue}` ;

date.textContent = displayDate;

const hourValue = sysDate.getHours();
const minuteValue = sysDate.getMinutes();

const displayTime = `${hourValue}${minuteValue}` ;
time.textContent = displayTime;