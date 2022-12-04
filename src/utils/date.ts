import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const formatDate = (date: Date) => {
  dayjs.extend(relativeTime);
  return dayjs(date).fromNow();
};
