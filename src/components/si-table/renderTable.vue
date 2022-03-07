<script>
import { betterDisplay, mappingState, amountFormat } from '@/utils/util.string';
import { cloneDeep } from 'lodash';
import store from '@/store';

/**
 * 渲染整个 table
 * 依赖于 si-standard-table 组件
 */
const renderTable = {
  functional: true,
  render(h, context) {
    // console.log('render renderTable, context:', context.parent._uid, context);
    return h(
      'si-standard-table',
      context.data,
      setColumn(h, context.parent, {
        columns: context.props.columns,
        language: store.getters['language'] || 'en',
        rowNum: context.data.attrs.data,
      })
    );
  }
}

/**
 * 建立多级栏目表头结构
 * @param {[array|object]} columns  [栏目树]
 * @param {[string]} language  [语言]
 * @param {[number]} rowNum  [数据行数]
 */
function setColumn(h, parent, { columns, language, rowNum }) {
  return Object.keys(columns).map(key => {
    const record = columns[key];
    if (record.labelKey) {
      record.label = store.vue.$t(record.labelKey);
    }
    if (!record.hidden) {
      if (record.children) {
        return renderColumn(h, parent, {
          record,
          language,
          children: setColumn(h, parent, {
            columns: record.children,
            language,
            rowNum,
          }),
          rowNum,
        });
      }
      return renderColumn(h, parent, {
        record,
        language,
        rowNum,
      });
    }
  });
}

/**
 * 渲染 column 栏目
 * @param  {[object]} record    [当前记录]
 * @param  {[string]} language     [语言]
 * @param  {[any]} children     [子集]
 * @param {[number]} rowNum  [数据行数]
 */
function renderColumn(h, parent, { record, language, children, rowNum }) {
  const props = cloneDeep(record);
  if (typeof props.width === 'object') {
    props.width = props.width[language];
  }
  if (typeof props.minWidth === 'object') {
    props.minWidth = props.minWidth[language];
  }
  if (!rowNum && props.fixed) {
    props.fixed = null;
  }
  if (!props.align) {
    props.align = 'center';
  }
  if (record.type === 'selection') {
    return h('el-table-column', { props })
  }
  return h(
    'el-table-column',
    {
      props,
      scopedSlots: {
        // slot-scope
        default(props) {
          if (record.render) {
            return record.render.bind(parent)(h, props.row, props.$index);
          } else {
            return formatCell(record, props.row);
          }
        },
        // slot-header
        header(props) {
          if (record.slotHeader) {
            return record.slotHeader.bind(parent)(h, props);
          }
          return props.column.label;
        }
      }
    },
    children
  );
}

/**
 * 格式化 cell 内容
 * @param  {[Object]} column    [当前记录]
 * @param  {[Object]} row     [子集]
 */
function formatCell(column, row) {
  const { prop, formatType, formatConfig } = column;
  switch (formatType) {
    case 'time':
      return formatTime(row, prop, formatConfig);
    case 'amount':
      return formatAmount(row, prop, formatConfig);
    case 'map':
      return formatMap(row, prop, formatConfig);
    default:
      return formatDefault(row, prop);
  }
}

function formatDefault(row, prop) {
  return betterDisplay(row[prop]);
}

function formatTime(row, prop, formatConfig) {
  return betterDisplay(store.vue.$util.formatTime(parseInt(row[prop])), formatConfig);
}

function formatAmount(row, prop, config) {
  return amountFormat(row[prop], !config ? '' : row[config.currencyProp]);
}

function formatMap(row, prop, config) {
  return betterDisplay(config ? mappingState(store.vue.$t(config.mapOptionsKey), row[prop]) : '');
}

export default renderTable;
</script>
