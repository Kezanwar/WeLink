import { isAfter } from 'date-fns';

const isExpired = (date: number) => {
  return isAfter(new Date(), new Date(date * 1000));
};

export default isExpired;
