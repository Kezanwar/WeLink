import { format } from 'date-fns';

const formatDate = (date: Date | number) => {
  if (typeof date === 'number') {
    return format(date * 1000, 'dd/M/yy @ HH:mm:ss');
  }
  return format(date, 'dd/M/yy @ HH:mm:ss');
};

export default formatDate;
