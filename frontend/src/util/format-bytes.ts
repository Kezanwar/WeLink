const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function formatBytes(input: number) {
  let index = 0;

  while (input >= 1024) {
    input = input / 1024;
    index++;
  }

  const precision = input < 10 && index > 0 ? 1 : 0;

  return input.toFixed(precision) + ' ' + units[index];
}

export default formatBytes;
