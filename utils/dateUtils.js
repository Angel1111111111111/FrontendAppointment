import { format as formatFns } from 'date-fns';
import { es } from 'date-fns/locale';

const TIMEZONE = 'America/Central';

export const formatDate = (date) => {
  const zonedDate = utcToZonedTime(new Date(date), TIMEZONE);
  return formatFns(zonedDate, "d 'de' MMMM 'de' yyyy", { locale: es });
};

export const formatTime = (date) => {
  const zonedDate = utcToZonedTime(new Date(date), TIMEZONE);
  return formatFns(zonedDate, 'HH:mm');
};

export const formatDateTime = (date) => {
  const zonedDate = utcToZonedTime(new Date(date), TIMEZONE);
  return formatFns(zonedDate, "yyyy-MM-dd'T'HH:mm");
};

export const convertToUTC = (dateStr) => {
  return zonedTimeToUtc(new Date(dateStr), TIMEZONE);
};

export const getTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour < 19; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};