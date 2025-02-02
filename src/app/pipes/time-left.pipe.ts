import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'timeLeft'
})
export class TimeLeftPipe implements PipeTransform {
  transform(value: string): string {
    const now = moment();
    const target = moment(value);

    if (now.isAfter(target)) {
      return 'Expired';
    }

    const daysLeft = target.diff(now, 'days');
    //const hoursLeft = target.diff(now, 'hours') % 24;
    //const minutesLeft = target.diff(now, 'minutes') % 60;

    return `${daysLeft}d`;
  }
}
