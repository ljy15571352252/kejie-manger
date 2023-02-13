<template>
    <div>
        <div
            class="pageContent flexC form-content"
            style="margin-top: 0; width: 100%"
        >
            <h2>安全设置</h2>
            <List>
                <ListItem>
                    <ListItemMeta
                        title="账户密码"
                        description="修改当前登录用户的密码"
                    />
                    <template slot="action">
                        <li>
                            <a
                                type="text"
                                @click="showModifyPasswordModal = true"
                                >修改</a
                            >
                        </li>
                    </template>
                </ListItem>
            </List>
        </div>
        <modify-password-modal v-model="showModifyPasswordModal" />
    </div>
</template>

<script>
import ModifyPasswordModal from "./modal/modify-password-form";
export default {
    name: "security-form",
    components: { ModifyPasswordModal },
    data() {
        return {
            showModifyPasswordModal: false,
        };
    },
    methods: {},
    created() {},
    mounted() {},
};
</script>

<style scoped lang="less">
.upload-img-tem {
    width: 80px;
    height: 80px;
    line-height: 80px;
}
/deep/.ivu-form-item-label {
    float: none;
    display: inline-block;
    padding: 0 0 10px 0;
}
</style>
