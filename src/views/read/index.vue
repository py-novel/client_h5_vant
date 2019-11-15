<template>
    <div>
        Read Page
    </div>
</template>

<script>
export default {
    mounted () {
        const { url, bookName, novelId } = this.$route.params
        console.log(url)
        console.log(bookName)
        console.log(novelId)
    }
}
</script>

<style lang="scss" scoped>

</style>