<template>
  <el-select
    v-model="valueData"
    v-bind="$attrs"
    class="easy-select"
    popper-class="easy-select-popper"
    v-on="$listeners"
    @change="onSelectChange">
    <template slot="prefix">
      <slot name="prefix">
        <img v-if="showOptionIcon && valueData" :src="getOptionIconUrl(selectedItem)" class="img-option-icon">
      </slot>
    </template>
    <slot>
      <el-option
        v-for="(item, index) in options"
        :key="item[optionKeyName] || String(index)"
        :value="item[optionValueName]"
        :label="getLabel(item)">
        <div v-if="showOptionIcon" class="option-item">
          <img :src="getOptionIconUrl(item)" class="img-option-icon">
          <span>{{ getLabel(item) }}</span>
        </div>
      </el-option>
    </slot>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex';
const EVENT = {
  CHANGE: 'change', // change 为 value 更新的事件，包含因 default 设置自动更新的
  SELECT: 'select', // select 为用户点击选择的事件
  UPDATE_SELECTED_ITEM: 'update:selectedItem'
};
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: String|Number,
    showOptionIcon: {
      type: Boolean,
      default: false
    },
    optionIconName: {
      type: String,
      default: 'icon'
    },
    optionKeyName: {
      type: String,
      default: 'key'
    },
    optionValueName: {
      type: String,
      default: 'value'
    },
    optionLabelName: {
      type: String,
      default: 'label'
    },
    labelCreator: Function,
    optionList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    optionSortFunc: Function,
    selectedItem: Object,
    defaultItemIndex: Number,
  },
  data() {
    return {
      valueData: this.value,
      initialledOptions: false,
    };
  },
  computed: {
    ...mapGetters(['language']),
    options() {
      if (!this.optionList || !this.optionList.length) return [];
      if (typeof this.optionSortFunc == 'function') {
        return this.optionSortFunc(Object.assign([], this.optionList), this.language) || [];
      } else {
        return this.optionList;
      }
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.valueData = newVal;
        this.updateSelectedItem(newVal);
      }
    },
    options: {
      immediate: true,
      deep: true,
      handler(val) {
        this.updateDefaultItem();
      }
    },
  },
  methods: {
    getOptionIconUrl(item) {
      return item && item[optionIconName];
    },
    getLabel(item) {
      if (this.labelCreator) {
        return this.labelCreator(item);
      } else {
        return item[this.optionLabelName];
      }
    },
    onSelectChange(value) {
      this.$emit(EVENT.SELECT, value);
      this.updateSelectedItem(value);
    },
    updateSelectedItem(value) {
      const selectedItem = this.options.find(item => value === item[this.optionValueName]);
      this.$emit(EVENT.UPDATE_SELECTED_ITEM, selectedItem);
    },
    updateDefaultItem() {
      // 无选项时，置空数据
      if (!this.options || !this.options.length) {
        this.valueData = '';
        this.updateSelectedItem('');
        return;
      }
      // 如果有 valueData，且 valueData 有对应 item，则直接按 valueData 更新取值，无需按 defaultItemIndex 获取，否则按 defaultItemIndex 获取
      if (this.valueData && this.options.some(item => item[this.optionValueName] === this.valueData)) {
        this.updateSelectedItem(this.valueData);
        return;
      }
      // 按 defaultItemIndex 更新
      // TODO 目前clear选择会将value置为空字符串，导致重新获取默认值，可考虑增加配置参数按条件过滤该情况
      if (this.defaultItemIndex != undefined && !isNaN(this.defaultItemIndex)) {
        this.valueData = this.options[this.defaultItemIndex][this.optionValueName];
        this.$emit(EVENT.CHANGE, this.valueData);
        this.updateSelectedItem(this.valueData);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
  .easy-select {
    height: 36px;
    line-height: 36px;
    /deep/ .el-input--prefix {
      .el-input__inner {
        padding-left: 41px;
      }
      .el-input__prefix {
        left: 15px;
        display: flex;
        align-items: center;
      }
    }
    .img-option-icon {
      display: block;
      width: 18px;
    }
  }
  .easy-select-popper {
    .el-select-dropdown__item {
      padding: 0 15px;
    }
    .option-item {
      display: flex;
      align-items: center;
      .img-option-icon {
        display: block;
        width: 18px;
        margin-right: 10px;
      }
    }
  }
</style>

