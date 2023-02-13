<template>
    <div>
        <Modal
            v-model="showModal"
            title="购买系统短信"
            :mask-closable="false"
            @on-visible-change="onVisibleChange"
        >
            <RadioGroup v-model="targetPriceCode">
                <Radio
                    :label="i.code"
                    v-for="(i, index) in priceList"
                    :key="index"
                    >({{ i.count }}){{ i.price | price }}</Radio
                >
            </RadioGroup>
            <div slot="footer">
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
import {
    getSysSmsPriceList,
    createSysSmsOrder,
} from "@/api/configset/smsconfig";

export default {
    name: "index",
    props: ["value"],
    data() {
        return {
            priceList: [],
            submitBtnLoading: false,
            targetPriceCode: null,
            showModal: false,
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        async onSubmit() {
            if (!this.targetPriceCode) {
                this.$Message.warning("请选择要购买的短信数量");
                return;
            }
            this.submitBtnLoading = true;
            let res = await createSysSmsOrder({
                priceCode: this.targetPriceCode,
            });
            this.submitBtnLoading = false;
            if (res ) this.onVisibleChange(false);
        },
    },
    async mounted() {
        let res = await getSysSmsPriceList();
        this.priceList = res;
    },
};
</script>

<style scoped lang="less"></style>
