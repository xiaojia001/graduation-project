<template >
	<div>	
	<el-submenu :index="index+''" v-if="!item.leaf">
		<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
		<el-menu-item v-for="child in item.children" :index="child.path" v-if="!child.hidden"><i :class="child.iconCls"></i>{{child.name}}</el-menu-item>
	</el-submenu>
	<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
	</div>
</template>
<script >
export default {
    data () {
      return {
        
      }
    },
    props:['index','item']
  }
</script>