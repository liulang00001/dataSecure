// 日历控件面板配置
export const PICKER_OPTIONS = {
  shortcuts: [
    {
      langKey: 'common.today',
      onClick(picker) {
        const start = new Date();
        const end = new Date();
        const startTimestamp = new Date(start.toLocaleDateString()).getTime();
        start.setTime(startTimestamp);
        end.setTime(startTimestamp + 24 * 3600 * 1000 - 1);
        picker.$emit('pick', [start, end]);
      }
    },
    {
      langKey: 'common.yesterday',
      onClick(picker) {
        const start = new Date();
        const end = new Date();
        const startTimestamp = new Date(start.toLocaleDateString()).getTime();
        start.setTime(startTimestamp - 24 * 3600 * 1000);
        end.setTime(startTimestamp - 1);
        picker.$emit('pick', [start, end]);
      }
    },
    {
      langKey: 'common.last7Days',
      onClick(picker) {
        const start = new Date();
        const end = new Date();
        const startTimestamp = new Date(start.toLocaleDateString()).getTime();
        start.setTime(startTimestamp - 6 * 24 * 3600 * 1000);
        end.setTime(startTimestamp + 24 * 3600 * 1000 - 1);
        picker.$emit('pick', [start, end]);
      }
    },
    {
      langKey: 'common.last30Days',
      onClick(picker) {
        const start = new Date();
        const end = new Date();
        const startTimestamp = new Date(start.toLocaleDateString()).getTime();
        start.setTime(startTimestamp - 29 * 24 * 3600 * 1000);
        end.setTime(startTimestamp + 24 * 3600 * 1000 - 1);
        picker.$emit('pick', [start, end]);
      }
    }
  ],
  disabledDate(time) {
    const timeMax = setTime(23, 59, 59, 999);
    return time > timeMax;
  }
};

function setTime(hour = 0, minute = 0, second = 0, millisecond = 0) {
  var date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(second);
  date.setMilliseconds(millisecond);
  return date;
}