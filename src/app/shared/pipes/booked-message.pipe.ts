import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appBookedMessage',
  standalone: true,
})
export class BookedMessagePipe implements PipeTransform {
  transform(
    bookedTime: string,
    allocatedTime: string,
    userName: string
  ): string {
    if (!bookedTime || !allocatedTime || !userName) {
      return 'Please provide valid booked time, allocated time, and user name.';
    }

    const [bookedHours, bookedMinutes] = bookedTime.split(':').map(Number);
    const [allocatedHours, allocatedMinutes] = allocatedTime
      .split(':')
      .map(Number);

    const totalBookedMinutes = bookedHours * 60 + bookedMinutes;
    const totalAllocatedMinutes = allocatedHours * 60 + allocatedMinutes;

    if (totalAllocatedMinutes === 0) {
      return 'Allocated time cannot be zero.';
    }

    const percentage = (totalBookedMinutes / totalAllocatedMinutes) * 100;

    let message = '';

    if (percentage <= 10) {
      const messages = [
        `${userName}, you need to start booking!`,
        `Hey ${userName}, come on, let's get started!`,
        `${userName}, time to begin booking!`,
        `${userName}, let's make a start!`,
        `Hello ${userName}, begin booking now!`,
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (percentage <= 30) {
      const messages = [
        `${userName}, you've got this, continue booking!`,
        `Keep going, ${userName}, you're doing great!`,
        `${userName}, keep up the good work!`,
        `Don't stop now, ${userName}, keep booking!`,
        `${userName}, you're making progress, keep it up!`,
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (percentage <= 50) {
      const messages = [
        `Alright, ${userName}, you're making good progress!`,
        `Good job, ${userName}, keep pushing!`,
        `Nice work, ${userName}, keep it up!`,
        `${userName}, you're halfway there, keep booking!`,
        `Keep going strong, ${userName}!`,
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (percentage <= 70) {
      const messages = [
        `Great job, ${userName}, keep it up!`,
        `${userName}, you're doing fantastic!`,
        `Awesome progress, ${userName}, keep going!`,
        `${userName}, you're almost there, keep pushing!`,
        `Keep it up, ${userName}, you're doing great!`,
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (percentage <= 90) {
      const messages = [
        `Almost there, ${userName}, keep pushing!`,
        `${userName}, you're so close, keep going!`,
        `Keep up the momentum, ${userName}!`,
        `Just a little more, ${userName}, you've got this!`,
        `Fantastic effort, ${userName}, keep booking!`,
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (percentage === 100) {
      const messages = [
        `Congratulations, ${userName}, you've booked 100%!`,
        `Well done, ${userName}, you've reached 100%!`,
        `Great job, ${userName}, you've achieved 100%!`,
        `Mission accomplished, ${userName}! You've booked 100%!`,
        `Fantastic job, ${userName}, you've reached your goal!`,
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    } else if (percentage > 100) {
      const messages = [
        `Woah, ${userName}, you've booked more than 100%!`,
        `Well done, ${userName}, you overachieved!`,
        `Great job, ${userName}, you've achieved 100% and more!`,
        `Mission overaccomplished, ${userName}! You've booked more than 100%!`,
        `Fantastic job, ${userName}, you've passed your goal!`,
      ];
      message = messages[Math.floor(Math.random() * messages.length)];
    }

    return message;
  }
}
