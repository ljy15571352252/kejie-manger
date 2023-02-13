<template>
    <div class="flexC">
        <Row>
            <Col :span="7">
                <Card
                    title="个人设置"
                    icon="ios-options"
                    :padding="0"
                    shadow
                    style="width: 300px"
                >
                    <CellGroup>
                        <Cell
                            v-for="(i, key) in menuList"
                            :key="key"
                            :title="i.title"
                            :label="i.desc"
                            :selected="targetMenu===i.value"
                            @click.native="targetMenu=i.value"
                        />
                    </CellGroup>
                </Card>
            </Col>
            <Col :span="17">
                <personal-form v-show="targetMenu === 1" />
                <security-form v-show="targetMenu === 2" />
            </Col>
        </Row>
    </div>
</template>

<script>
import PersonalForm from "@/views/setting/components/personal-form";
import SecurityForm from "./components/security-form";
export default {
    name: "index",
    components: { PersonalForm, SecurityForm },
    data() {
        return {
            targetMenu: 1,
            menuList: [
                {
                    title: "基本设置",
                    desc: "个人信息设置",
                    value: 1,
                },
                {
                    title: "安全设置",
                    desc: "密码修改",
                    value: 2,
                },
            ],
        };
    },
    async created() {

    },
    mounted() {},
    methods: {},
    watch: {},
    filters: {},
};
</script>

<style lang="less">
.main-page {
}
</style>
