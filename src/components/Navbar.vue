<template>
    <div>
        <van-tabbar route>
            <van-tabbar-item to="/shelf" icon="home-o">书架</van-tabbar-item>
            <van-tabbar-item to="/classify" icon="search">书屋</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
import { Tabbar, TabbarItem } from "vant";

export default {
    name: 'Navbar',
    components: {
        [Tabbar.name]: Tabbar,
        [TabbarItem.name]: TabbarItem
    },
};
</script>

<style scoped>
</style>