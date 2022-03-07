/**
import all global methods/fields here
*/
import Vue from 'vue';

import util from '@/utils/common';
import langUtils from '@/utils/langUtils';
import { mappingState } from '@/utils/stringUtil';
import { closeTagView } from '@/utils/viewUtil';
const lodash = require('lodash');

Vue.prototype.$util = util;
Vue.prototype.$langUtils = langUtils;
Vue.prototype.$$t = langUtils.$$t;
Vue.prototype.$$tc = langUtils.$$tc;
Vue.prototype.$integrateLang = langUtils.integrateLang;
Vue.prototype.$merge = lodash.merge;
Vue.prototype.$mappingState = mappingState;
Vue.prototype.$closeTagView = closeTagView;