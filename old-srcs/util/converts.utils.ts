export function stringToArray(str: string): string[] {
  return str ? str.split(',') : [];
}

export function arrayToString(arr: string[]): string {
  return arr.join(',');
}
