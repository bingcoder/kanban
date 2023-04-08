export function formatValues(values: any) {
  const { date, ...restValues } = values;
  const [s, e] = date;
  return {
    startTime: s.format("YYYY-MM-DD"),
    endTime: e.format("YYYY-MM-DD"),
    ...restValues,
  };
}
