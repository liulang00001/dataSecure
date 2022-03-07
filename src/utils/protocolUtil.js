import Vue from 'vue';

export function showErrorMessage(err) {
  if (err && err !== 'error') {
    let msg = err;
    if (err.message) {
      msg = err.message;
    }

    Vue.prototype.$message({
      message: msg,
      type: 'error'
    });
  }
}
