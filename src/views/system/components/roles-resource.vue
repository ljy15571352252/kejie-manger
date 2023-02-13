<template>
    <div>
        <Modal
            v-model="showModal"
            title="分配权限"
            :mask-closable="false"
            :loading="submitBtnLoading"
            @on-ok="onSubmit"
            ok-text="提交"
            @on-visible-change="onVisibleChange"
        >
            <Tree ref="tree" :data="resources" show-checkbox multiple></Tree>
            <div slot="footer">
                <Button type="primary" ghost @click="onExpandAllToggle">{{
                    expandAll ? "全部收起" : "全部展开"
                }}</Button>
                <Button type="primary" ghost @click="onCheckAll">{{
                    checkAll ? "全部选择" : "全部取消"
                }}</Button>
                <Button
                    type="primary"
                    :loading="submitBtnLoading"
                    @click="onSubmit"
                    >提交</Button
                >
            </div>
        </Modal>
    </div>
</template>

<script>
import { PAGE_MODE } from "@/common/constants";
import { getRoleResources, setRoleResources } from "@/api/user/role";
import { getResources } from "@/api/user/resources";

export default {
    name: "index",
    props: ["value", "code"],
    data() {
        return {
            showModal: false,
            submitBtnLoading: false,
            resources: [],
            expandAll: true,
            checkAll: true,
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
        code() {
            this.getData();
        },
    },
    methods: {
        convertTree: function (tree, map) {
            // ...
        },
        // 设置全选与反选树，第一个参数值为树，第二个参数值为true为全选，false为反选
        convertTreeCheck(tree, type, val) {
            const result = [];
            tree.forEach(item => {
                // 读取 map 的键值映射
                let expand = type === 1 ? item.expand : val;
                let checked = type === 2 ? item.checked : val;
                let title = item.title;
                let code = item.code;
                let children = item.children;
                // 如果有子节点，递归
                if (children) {
                    children = this.convertTreeCheck(children, type, val);
                }
                result.push({ expand, code, checked, title, children });
            });
            return result;
        },
        onExpandAllToggle() {
            this.expandAll = !this.expandAll;
            this.resources = this.convertTreeCheck(
                this.resources,
                2,
                this.expandAll
            );
        },
        onCheckAll() {
            this.resources = this.convertTreeCheck(
                this.resources,
                1,
                this.checkAll
            );
            this.checkAll = !this.checkAll;
        },
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        setTreeData(resources) {
            return resources.map(item => {
                let children = item.children;
                let expand = false;
                if (children) {
                    expand = true;
                    children = this.setTreeData(children);
                    return {
                        title: item.name,
                        code: item.code,
                        expand: expand,
                        children,
                    };
                }
                return {
                    title: item.name,
                    code: item.code,
                };
            });
        },
        setNodeSelect(list, code) {
            for (let i in list) {
                let item = list[i];
                if (item.code === code) {
                    this.$set(item, "checked", true);
                    break;
                }
                if (item.children) {
                    this.setNodeSelect(item.children, code);
                }
            }
        },
        findSelectNode(roleResource) {
            roleResource.forEach(i => {
                this.setNodeSelect(this.resources, i.code);
            });
        },
        async getData() {
            let { resources } = await getRoleResources({ roleCode: this.code });
            this.findSelectNode(resources);
        },
        async onSubmit() {
            const items = this.$refs.tree.getCheckedNodes();
            const selectedCodes = items.map(i => i.code);
            this.submitBtnLoading = true;
            let res = await setRoleResources({
                roleCode: this.code,
                resourceCodes: selectedCodes,
            });
            this.submitBtnLoading = false;
            if (res ) {
                this.$Message.success("操作成功");
                if (this.mode === PAGE_MODE.ADD) this.onReset();
                this.$emit("on-set-finish");
            }
            this.$emit("input", false);
        },
    },
    async mounted() {
        let res = await getResources();
        this.resources = this.setTreeData(res);
        //  this.resources[0].children[0].checked=true
    },
};
</script>

<style scoped></style>
