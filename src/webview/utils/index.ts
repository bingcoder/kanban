import { Dayjs } from "dayjs";
import { customAlphabet } from "nanoid";
export const uuid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 10);

export const fakeResolve = (t = 500) =>
  new Promise((r) => {
    setTimeout(r, t);
  });

const DefaultDateTemplate = "YYYY-MM-DD";

export function formatDevelopDateValues(date: [Dayjs, Dayjs]) {
  const [s, e] = date;
  return {
    developStartAt: s.format(DefaultDateTemplate),
    developEndAt: e.format(DefaultDateTemplate),
  };
}
