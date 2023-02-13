<template>
    <div
        :class="{ 'pageHead-fix': noMargin, flexC: true, pageHead: !noMargin }"
    >
        <p>{{ title }}</p>
        <p v-if="description">{{ description }}</p>
        <p v-else></p>
    </div>
</template>

<script>
export default {
    name: "index",
    props: {
        title: String,
        description: String,
        noMargin: Boolean,
    },
    methods: {},
};
</script>

<style scoped></style>
