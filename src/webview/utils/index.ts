import { Dayjs } from "dayjs";
import { customAlphabet } from "nanoid";
export const uuid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 10);

const DefaultDateTemplate = "YYYY-MM-DD";

export function formatDevelopDateValues(date: [Dayjs, Dayjs]) {
  const [s, e] = date;
  return {
    developStartAt: s.format(DefaultDateTemplate),
    developEndAt: e.format(DefaultDateTemplate),
  };
}
