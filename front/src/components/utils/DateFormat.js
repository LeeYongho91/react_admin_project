export function DateFormat(date) {
  const tDate = new Date(date);
  tDate.setHours(tDate.getHours() + 9);
  return tDate.toISOString().slice(0, 19).replace(/-/g, '-').replace('T', ' ');
}
