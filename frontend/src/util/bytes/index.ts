const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

function formatBytes(x: number) {
  let l = 0;

  while (x >= 1024 && ++l) {
    x = x / 1024;
  }

  return x.toFixed(x < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
}

export default formatBytes;
