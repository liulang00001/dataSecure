<template>
  <el-date-picker
    v-model="valueData"
    v-bind="attrs"
    v-on="listeners"
    @change="onDateChange" />
</template>

<script>
import moment from 'moment';

export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      }
    },
    startTime: '',
    endTime: '',
  },
  data() {
    return {
      valueData: [this.startTime, this.endTime],
    };
  },
  computed: {
    attrs() {
      return {
        ...{
          'default-time': ['00:00:00', '23:59:59'],
          'range-separator': this.$t('common.to'),
          'start-placeholder': this.$t('common.placeholderStartDate'),
          'end-placeholder': this.$t('common.placeholderEndDate'),
          'picker-options': this.pickerOptions,
          'unlink-panels': true,
          type: 'daterange',
          align: 'right',
          clearable: true,
        },
        ...this.$attrs
      };
    },
    listeners() {
      return { ...this.$listeners };
    },
    pickerOptions() {
      const vm = this;
      return {
        shortcuts: [
          {
            text: this.$t('common.today'),
            onClick(picker) {
              const startDate = new Date();
              const start = vm.getStartTimeOfDay(startDate);
              const end = vm.getEndTimeOfDay(startDate);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t('common.yesterday'),
            onClick(picker) {
              const startDate = new Date();
              const start = vm.getStartTimeOfDay(new Date(startDate.getTime() - 1000 * 3600 * 24 * 1));
              const end = vm.getEndTimeOfDay(new Date(startDate.getTime() - 1000 * 3600 * 24 * 1));
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t('common.last7Days'),
            onClick(picker) {
              const startDate = new Date();
              const start = vm.getStartTimeOfDay(new Date(startDate.getTime() - 1000 * 3600 * 24 * 6));
              const end = vm.getEndTimeOfDay(new Date());
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: this.$t('common.last30Days'),
            onClick(picker) {
              const startDate = new Date();
              const start = vm.getStartTimeOfDay(new Date(startDate.getTime() - 1000 * 3600 * 24 * 29));
              const end = vm.getEndTimeOfDay(new Date());
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        disabledDate: this.disabledDateFncDefault,
        onPick({ maxDate, minDate }) {
          if (vm.options.rangeLimit) {
            if (maxDate) {
              this.disabledDate = vm.disabledDateFncDefault;
            } else {
              const min = moment(minDate).subtract(30, 'days');
              const max = moment(minDate).add(30, 'days');
              this.disabledDate = (date) => {
                return date.getTime() < min.valueOf() || date.getTime() > max.valueOf() || date.getTime() > Date.now();
              };
            }
          }
        },
      };
    }
  },
  watch: {
    startTime() {
      this.valueData = [this.startTime, this.endTime];
    },
    endTime() {
      this.valueData = [this.startTime, this.endTime];
    }
  },
  methods: {
    disabledDateFncDefault(date) {
      return date > this.getEndTimeOfDay(new Date());
    },
    getStartTimeOfDay(date) {
      if (date instanceof Date) {
        const newDate = new Date(date);
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
        return newDate;
      }
      return null;
    },
    getEndTimeOfDay(date) {
      if (date instanceof Date) {
        const newDate = new Date(date);
        newDate.setHours(23);
        newDate.setMinutes(59);
        newDate.setSeconds(59);
        newDate.setMilliseconds(999);
        return newDate;
      }
      return null;
    },
    onDateChange(val) {
      let startTime = val && val[0] || '';
      let endTime = val && val[1] || '';
      if (this.options.rangeLimit && startTime && endTime) {
        const dataRange = this.defaultValueFilter([startTime, endTime]);
        startTime = dataRange[0];
        endTime = dataRange[1];
      }
      this.$emit('update:startTime', startTime);
      this.$emit('update:endTime', endTime);
      this.$emit('change', [startTime, endTime]);
    },
    defaultValueFilter(val) {
      if (moment(val[1]).diff(val[0], 'days') > 30) {
        return [val[0], this.getEndTimeOfDay(moment(val[0]).add(30, 'days').toDate())];
      }
      return val;
    },
  }
};
</script>