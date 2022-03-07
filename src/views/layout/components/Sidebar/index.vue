<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.name"
      :collapse="isCollapse"
      unique-opened
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { asyncRouterMap, constantRouterMap } from '@/router/routerMap';
import { filterAsyncRouter, filterAsyncRouterByPermission } from '@/utils/permission';

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'isQiankun',
    ]),
    isCollapse() {
      if(this.$store.getters.isQiankun) {
        return !this.sidebar.opened
      }
      return false;
    },
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-menu-item {
  &.is-active {
    color: #fff !important;
    background-color: #409EFF !important;
  }
}
</style>
