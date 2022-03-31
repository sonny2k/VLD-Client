import { format } from 'date-fns';

const d1 = new Date();
const d2 = new Date();
const d3 = new Date();
const d4 = new Date();
const d5 = new Date();
const d6 = new Date();
const d7 = new Date();
d1.setDate(d1.getDate() + 1);
d2.setDate(d2.getDate() + 2);
d3.setDate(d3.getDate() + 3);
d4.setDate(d4.getDate() + 4);
d5.setDate(d5.getDate() + 5);
d6.setDate(d6.getDate() + 6);
d7.setDate(d7.getDate() + 7);
export const datearray = [];

if (d1 && d2 && d3 && d4 && d5 && d6 && d7) {
    const day1 = format(new Date(d1), 'yyyy-MM-dd');
    const day2 = format(new Date(d2), 'yyyy-MM-dd');
    const day3 = format(new Date(d3), 'yyyy-MM-dd');
    const day4 = format(new Date(d4), 'yyyy-MM-dd');
    const day5 = format(new Date(d5), 'yyyy-MM-dd');
    const day6 = format(new Date(d6), 'yyyy-MM-dd');
    const day7 = format(new Date(d7), 'yyyy-MM-dd');
    datearray.push({value: day1}, {value: day2}, {value: day3}, {value: day4}, {value: day5}, {value: day6}, {value: day7});
}