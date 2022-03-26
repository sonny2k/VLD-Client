import { format } from 'date-fns';

const d1 = new Date();
const d2 = new Date();
const d3 = new Date();
d1.setDate(d1.getDate() + 1);
d2.setDate(d1.getDate() + 1);
d3.setDate(d2.getDate() + 1);
export const datearray = [];

if (d1 && d2 && d3) {
    const day1 = format(new Date(d1), 'yyyy-MM-dd');
    const day2 = format(new Date(d2), 'yyyy-MM-dd');
    const day3 = format(new Date(d3), 'yyyy-MM-dd');
    datearray.push({value: day1}, {value: day2}, {value: day3});
}
console.log(datearray);