<template>
  <el-dialog
    :title="$t('common.downloadEmail.title')"
    :visible="showing"
    :show-close="false"
    width="450px">
    <span v-html="$t('common.downloadEmail.message', { email: getName() + '@ushareit.com' })" />
    <span slot="footer">
      <el-button type="primary" @click="showing = false">{{ $t('common.actions.ok') }}</el-button>
    </span>
  </el-dialog>
  
</template>
<script>
import { getName } from '@/utils/user';
export default {
  data() {
    return {
      showing: false,
    }
  },
  methods: {
    getName,
    show() {
      this.showing = true;
    }
  },
}

</script>