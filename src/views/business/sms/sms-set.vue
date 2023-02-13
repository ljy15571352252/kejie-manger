<template>
    <div class="flexC">
        <page-header title="短信配置" description="短信配置" />
        <div class="pageContent flexC form-content">
            <Tabs v-model="curTab">
                <TabPane label="短信配置" name="smsconfig">
                    <sms-config
                        :sms-config-obj="smsConfig"
                        @on-update="getConfig"
                    />
                </TabPane>
                <TabPane label="配置短信模板" name="smsTemConfig">
                    <template v-if="curTab === 'smsTemConfig'">
                        <sms-tem-config :sms-config-obj="smsConfig" />
                    </template>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
import SmsConfig from "./components/sms-config";
import SmsTemConfig from "./components/sms-tem-config";
import { getSmsConfig } from "@/api/configset/smsconfig";

export default {
    name: "index",
    components: { SmsConfig, SmsTemConfig },
    data() {
        return {
            curTab: "smsconfig",
            smsConfig: {},
        };
    },
    created() {
        this.getConfig();
    },
    mounted() {},
    methods: {
        async getConfig() {
            this.smsConfig = await getSmsConfig();
        },
    },
    watch: {},
    filters: {},
};
</script>

<style scoped lang="less">
.form-item-inp {
    width: 300px;
}
.form-content {
    padding-top: 30px;
    padding-left: 30px;
}
</style>
