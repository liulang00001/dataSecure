<template>
  <el-input
    v-model.trim="selfValue"
    v-bind="$attrs"
    :maxlength="maxLength"
    title=""
    style="ime-mode: disabled"
    @keydown.native="onKeyDown"
    @change="changeHandle"
    v-on="$listeners">
    <template slot="prepend">
      <slot name="prepend"></slot>
    </template>
    <template slot="append">
      <slot name="append"></slot>
    </template>
  </el-input>
</template>

<script>
import local from './local';
import { validateNumber, validateDotAndNumber } from '@/utils/validate';

const SCOPE_NAME = 'siInput';

export default {
  name: SCOPE_NAME,
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    // amount【金额】，account【银行账号】，orderNo【单号】，percent【百分比】，integer【整数】，tel【电话号码】
    inputType: {
      type: String,
      default: 'amount',
    },
    value: [String, Number],
    currency: String,
    // 小数长度限制
    decimalLimit: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      selfValue: '',
      // 触发change事件时，需要对个别类型做number的矫正
      fixNumberTypes: ['amount', 'percent', 'integer'],
    };
  },
  computed: {
    // 整数长度限制
    integerLimit() {
      if (['amount', 'percent'].includes(this.inputType)) {
        return 13;
      }
    },
    // 最大长度限制
    maxLength() {
      if (this.$attrs.maxlength) {
        return this.$attrs.maxlength;
      }
      const val = String(this.selfValue);
      if (['amount', 'percent'].includes(this.inputType)) {
        if (val === '') {
          return this.integerLimit + 1 + this.decimalLimit;
        }
        return val.includes('.') ? this.integerLimit + 1 + this.decimalLimit : this.integerLimit + 1;
      }
      if (this.inputType === 'account') {
        return 50;
      }
      if (this.inputType === 'orderNo') {
        return 64;
      }
      if (this.inputType === 'integer') {
        return 15;
      }
      if (this.inputType === 'tel') {
        return 50;
      }
      return 256;
    },
    // 最小值
    minValue() {
      let attrMin = this.$attrs.min;
      attrMin || attrMin === 0 ? attrMin = Number(attrMin) : '';
      return this.inputType === 'percent' ? (attrMin || 0) : attrMin;
    },
    // 最大值
    maxValue() {
      let attrMax = this.$attrs.max;
      attrMax || attrMax === 0 ? attrMax = Number(attrMax) : '';
      return this.inputType === 'percent' ? (attrMax || 100) : attrMax;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val === undefined || val === null) {
          this.selfValue = '';
        } else {
          this.selfValue = String(val);
        }
      },
    },
    // mac系统caps_lock等按键会将输入法拼音放入输入框中，且因为非字符键无法触发keyUp事件，无法对非法字符进行过滤
    selfValue(value) {
      let fixVal = String(value);
      let fixFlag = false;
      // 过滤非法字符
      const filterIllegal = (val) => {
        const pattern = this.getIllegalPattern();
        if (pattern.test(val)) {
          fixVal = val.replace(pattern, '');
          fixFlag = true;
        }
      };
      // 值大于1则开头0需要抹去
      const filterZero = (val) => {
        if (/^\b0\d+/g.test(val)) {
          fixVal = val.replace(/^\b0+/g, parseFloat(val) < 1 ? '0' : '');
          fixFlag = true;
        }
      };
      // 尾部特殊符号需要抹去
      const filterEndIllegal = (val) => {
        if (/\b\d+[-]+$/g.test(val)) {
          fixVal = val.replace(/\b[-]+$/g, '');
          fixFlag = true;
        }
      };
      // 整数最多integerLimit位
      const limitIntegerPlace = (val) => {
        let integerValue = val.split('.')[0];
        const decimalValue = val.split('.')[1];
        if (integerValue && integerValue.length > this.integerLimit) {
          integerValue = `${integerValue.substr(0, this.integerLimit)}`;
          fixVal = integerValue;
          fixFlag = true;
        }
        if (decimalValue) {
          fixVal = `${integerValue}.${decimalValue}`;
        }
      };
      // 小数点最多decimalLimit位
      const limitDecimalPlace = (val) => {
        const integerValue = val.split('.')[0];
        const decimalValue = val.split('.')[1];
        if (decimalValue && decimalValue.length > this.decimalLimit) {
          fixVal = `${integerValue}.${decimalValue.substr(0, this.decimalLimit)}`;
          fixFlag = true;
        }
      };
      // 限制数值范围
      const limitRange = (val) => {
        const min = this.minValue;
        const max = this.maxValue;
        if (val && (min || min === 0) && min > Number(val)) {
          fixVal = min;
          fixFlag = true;
        } else if (val && (max || max === 0) && max < Number(val)) {
          fixVal = max;
          fixFlag = true;
        }
      };
      filterIllegal(fixVal);
      if (this.inputType === 'amount') {
        filterZero(fixVal);
        limitIntegerPlace(fixVal);
        limitDecimalPlace(fixVal);
        limitRange(fixVal);
      }
      if (this.inputType === 'percent') {
        filterZero(fixVal);
        limitIntegerPlace(fixVal);
        limitDecimalPlace(fixVal);
        limitRange(fixVal);
      }
      if (this.inputType === 'integer') {
        filterZero(fixVal);
        filterEndIllegal(fixVal);
        limitRange(fixVal);
      }
      if (fixFlag) {
        this.selfValue = fixVal;
      } else {
        this.$emit('input', fixVal);
        if (this.inputType === 'amount') {
          this.checkAmountByCurrency(fixVal);
        }
      }
    },
    // 语言切换时校验金额格式
    currency() {
      if (this.inputType === 'amount') {
        this.checkAmountByCurrency(this.selfValue, true);
      }
    },
    // 国际化语言切换
    '$store.getters.language': function() {
      if (this.inputType === 'amount') {
        this.checkAmountByCurrency(this.selfValue, true);
      }
    },
  },
  created() {
    if (!this.$i18n.getLocaleMessage('en')[SCOPE_NAME]) {
      this.$i18n.mergeLocaleMessage('en', local.en);
      this.$i18n.mergeLocaleMessage('zh', local.zh);
    }
  },
  methods: {
    // 输入限制
    onKeyDown(e) {
      const preventDefault = function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      };
      const CODE_MAP = {
        META: 91,
        BACKSPACE: 8,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40,
        TAB: 9,
        CAPS_LOCK: 20,
        DELETE: 46,
      };
      const key = e.key;
      const keyCode = e.keyCode;
      const value = e.target.value;
      // 安全键
      if (Object.values(CODE_MAP).includes(keyCode)) {
        e.returnValue = true;
        return;
      }
      // 允许（全选，复制，粘贴）
      var isMac = /macintosh|mac os x/i.test(navigator.userAgent.toLowerCase());
      if (((isMac && e.metaKey) || (!isMac && e.ctrlKey)) && /[acv]/g.test(key)) {
        e.returnValue = true;
        return;
      }
      // 输入法屏蔽（存在兼容问题，chrome和opera不支持）
      if (keyCode === 229) {
        preventDefault(e);
        return;
      }
      // 禁止输入非法字符
      const pattern = this.getIllegalPattern();
      if (pattern.test(key)) {
        preventDefault(e);
        return;
      }
      if (['amount', 'percent'].includes(this.inputType)) {
        // 不允许首字母是.且只允许输入一个.
        if (key === '.' && (!value || value.includes('.'))) {
          preventDefault(e);
          return;
        }
        const { selectionStart, selectionEnd } = e.target;
        // 正常输入，非选中替换时
        if (selectionStart === selectionEnd) {
          if (!value.includes('.')) {
            // 如果无小数点，则输入上限位时需要判断，只可输入小数点
            if (value.length === this.maxLength - 1 && key != '.') {
              preventDefault(e);
              return;
            }
          } else {
            // 如果有小数点
            // 整数位等于integerLimit位时不能输入
            const integerValue = value.split('.')[0];
            if (integerValue.length >= this.integerLimit && selectionStart <= this.integerLimit) {
              preventDefault(e);
              return;
            }
            // 小数位等于decimalLimit位时不能输入
            const decimalValue = value.split('.')[1];
            if (decimalValue.length >= this.decimalLimit && selectionStart > integerValue.length) {
              preventDefault(e);
              return;
            }
          }
        }
      }
    },
    // 失焦
    changeHandle(val) {
      if (val) {
        if (this.fixNumberTypes.includes(this.inputType)) {
          const numValue = Number(val);
          if (!Object.is(NaN, numValue)) {
            this.selfValue = String(numValue);
          }
        } else {
          this.selfValue = String(val);
        }
      }
    },
    // 获取非法字符正则表达式（正则表达不能放到data，computed中，连续test的值会出现循环颠倒））
    getIllegalPattern() {
      if(/^\/.+(\/[i|g]?$)/.test(this.inputType)) {
        try {
          let str = this.inputType.replace(/^\//, '').replace(/\/[ig]?$/, '');
          let flag = (this.inputType.match(/\/[ig]?$/))[0];
          flag = flag.slice(1)
          return new RegExp(str, flag);
        } catch (e) {
          console.warn(new Error('si-input getIllegalPattern Error'))
          return /[^0-9.-]/g;
        }
      }
      if (this.inputType === 'amount') {
        return /[^0-9.]/g;
      }
      if (this.inputType === 'account') {
        return /[^\d]/g;
      }
      if (this.inputType === 'orderNo') {
        return /[^0-9A-Za-z_]/g;
      }
      if (this.inputType === 'percent') {
        return /[^0-9.]/g;
      }
      if (this.inputType === 'integer') {
        return /[^0-9-]/g;
      }
      if (this.inputType === 'tel') {
        return /[^0-9-+]/g;
      }
      return /[^0-9.-]/g;
    },
    // 根据币种校验金额格式
    checkAmountByCurrency(amount, isCheck) {
      if (this.currency && this.currency.toUpperCase() === 'IDR') {
        if (validateNumber(amount) && parseInt(amount) > 0) {
          this.$emit('validate', {
            result: true,
            isCheck,
          });
          return;
        }
      } else {
        if (validateDotAndNumber(amount) && parseFloat(amount) >= 0.01) {
          this.$emit('validate', {
            result: true,
            isCheck,
          });
          return;
        }
      }
      this.$emit('validate', {
        msg: this.$t('siInput.amountError'),
        result: false,
        isCheck,
      });
    },
  },
};
</script>
