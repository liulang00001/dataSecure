/**
 add global components here.
 */

import Vue from 'vue';
import VueParticles from 'vue-particles';
import VueDraggable from 'vuedraggable';
import BaseButton from './BaseButton/index';
import SiStandardTable from './si-table/standardTable';
import SiRenderTable from './si-table/renderTable';
import SiInput from './si-input';
import SiUpload from './si-upload';
import EasySelect from './easy-select';
import DataDiffDialog from './dataDiff/dataDiffDialog';
import DataDiff from './dataDiff/dataDiffItem';
// from third part
Vue.use(VueParticles);
Vue.component('vue-draggable', VueDraggable);

// customer components
Vue.component('omc-feature-title', () => import('./FeatureTitle'));
Vue.component('omc-feature-content', () => import('./FeatureContent'));
Vue.component('omc-markdown-view', () => import('./MarkdownView'));
Vue.component('omc-table', () => import('./Table/standardTable'));
Vue.component('omc-date-range-picker', () => import('./Date/rangePicker'));
Vue.component('omc-page-header', () => import('./PageHeader/index'));
Vue.component('easy-select', EasySelect);
Vue.component('base-button', BaseButton);
Vue.component('si-standard-table', SiStandardTable);
Vue.component('si-render-table', SiRenderTable);
Vue.component('si-input', SiInput);
Vue.component('si-upload', SiUpload);
Vue.component('data-diff-dialog', DataDiffDialog);
Vue.component('data-diff', DataDiff);
