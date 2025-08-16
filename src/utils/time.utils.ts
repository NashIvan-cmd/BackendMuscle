// function timeToSeconds({
//   days = 0,
//   hours = 0,
//   minutes = 0
// }: {
//   days?: number;
//   hours?: number;
//   minutes?: number;
// }): number {
//   return (days * 24 * 60 * 60) +
//          (hours * 60 * 60) +
//          (minutes * 60);
// }

// // Usage
// timeToSeconds({ days: 1, hours: 2, minutes: 30 }); // → 95400
// timeToSeconds({ hours: 5 });                       // → 18000
// timeToSeconds({});                                 // → 0

// object destructuring used for labeled arguments
// Sometimes we want labeled argument to explicitly tell when you call the FN 
export function daysToSeconds({ days = 0 }: { days: number }): number{
    return days * 24 * 60 * 60;
}

// OR

/*
 not immediatelly destructured
 function daysToSecond (params: { days: number }): number {
    const { days } = params;
    return days * 24 * 60 * 60;
 } 
*/

