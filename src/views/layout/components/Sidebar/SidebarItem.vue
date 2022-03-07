<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
      <template v-if="!item.hidden && item.children">

        <router-link v-if="hasOneShowingChildren(item.children) && !item.children[0].children && !item.alwaysShow" :to="{'name': item.children[0].name}" :key="item.children[0].name">
          <el-menu-item :index="item.children[0].name" :class="{'submenu-title-noDropdown': !isNest}">
            <svg-icon v-if="item.children[0].meta && item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
            <span v-if="item.children[0].meta && item.children[0].meta.title" slot="title">{{generateTitle(item.children[0].meta.title)}}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-else :index="item.name" :key="item.name">
          <template slot="title">
            <svg-icon v-if="item.meta && item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
            <span v-if="item.meta && item.meta.title" slot="title" :class="{'no-icon': !item.meta.icon}">{{generateTitle(item.meta.title)}}</span>
          </template>

          <template v-for="child in item.children">
            <template v-if="!child.hidden">
              <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children && child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

              <router-link v-else :to="{ 'name': child.name, 'params': { 'target': 'menu' } }" :key="child.name">
                <el-menu-item :index="child.name" :class="child.meta.customClass">
                  <svg-icon v-if="child.meta && child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                  <span v-if="child.meta && child.meta.title" slot="title" :class="{'no-icon': !child.meta.icon}">{{generateTitle(child.meta.title)}}</span>
                </el-menu-item>
              </router-link>
            </template>
          </template>
        </el-submenu>

      </template>
    </template>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n';

export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden;
      });
      if (showingChildren.length === 1) {
        return true;
      }
      return false;
    },
    generateTitle
  }
};
</script>

<style lang="scss" scoped>
.lv3 {
  height: 56px;
  line-height: 56px;
  padding-left: 54px !important;
  .no-icon {
    color: #7b8898;
  }
  &.is-active .no-icon {
    color: #fff;
  }
}
.svg-icon {
  width: 14px !important;
  height: 14px !important;
  margin-right: 16px !important;
}
.no-icon {
  margin-left: 14px !important;
}
</style>


