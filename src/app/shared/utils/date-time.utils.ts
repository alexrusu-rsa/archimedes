export function convertTimeToHours(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
}

export function calculateUpdatedTime(
  currentTime: string,
  timeToAdd = '00:00',
  timeToRemove = '00:00'
): string {
  const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
  const [addHours, addMinutes] = timeToAdd.split(':').map(Number);
  const [removeHours, removeMinutes] = timeToRemove.split(':').map(Number);

  const totalCurrentMinutes = currentHours * 60 + currentMinutes;
  const totalAddMinutes = addHours * 60 + addMinutes;
  const totalRemoveMinutes = removeHours * 60 + removeMinutes;

  let updatedTotalMinutes =
    totalCurrentMinutes + totalAddMinutes - totalRemoveMinutes;

  if (updatedTotalMinutes < 0) {
    updatedTotalMinutes = 0;
  }

  const updatedHours = Math.floor(updatedTotalMinutes / 60);
  const updatedMinutes = updatedTotalMinutes % 60;

  return `${String(updatedHours).padStart(2, '0')}:${String(
    updatedMinutes
  ).padStart(2, '0')}`;
}
