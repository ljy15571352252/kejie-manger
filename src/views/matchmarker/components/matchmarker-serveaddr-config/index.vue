<template>
    <div>
        <Modal
            v-model="showModal"
            title="服务区设置"
            :mask-closable="false"
            :loading="submitBtnLoading"
            @on-ok="onSubmit"
            width="750"
            ok-text="确认"
            @on-visible-change="onVisibleChange"
        >
            <Form
                :model="myForm"
                ref="myForm"
                :rules="ruleValidate"
                :label-width="120"
            >
                <FormItem label="红娘地址" prop="mapSearch">
                    <AutoComplete
                        v-model="myForm.mapSearch"
                        @on-search="searchFromMap"
                        placeholder="地址搜索"
                        @on-select="setPlace"
                    >
                        <Option
                            v-for="(option, index) in mapSearchResult"
                            :value="option.value"
                            :key="index"
                        >
                                    <span
                                    ><Icon
                                        type="ios-search-outline"
                                        style="margin-right: 5px"
                                    />{{ option.label }}</span
                                    >
                            <span style="float: right; color: #ccc">{{
                                    option.area
                                }}</span>
                        </Option>
                    </AutoComplete>
                </FormItem>

                <FormItem label="经度" prop="lon">
                    <Input v-model="myForm.lon" disabled></Input>
                </FormItem>
                <FormItem label="纬度" prop="lat">
                    <Input v-model="myForm.lat" disabled></Input>
                </FormItem>
                <map-search
                    map-height="300px"
                    ref="mapCom"
                    @on-auto-complete="onMapAutoComplete"
                    @on-marker-select="onMapPointSelect"
                    style="margin-bottom: 20px"
                />
            </Form>
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
import { editMatchMarker } from "@/api/matchmarker/matchmarker";
import MapSearch from "@/components/map/map-search";

export default {
  components: { MapSearch },
    name: "matchmarker-serveaddr",
    props: ["value", "matchmarker"],
    data() {
        return {
            mapSearchResult:[],
            showModal: false,
            submitBtnLoading: false,
            myForm: {
            },
            ruleValidate: {
                mapSearch: [
                    {
                        required: true,
                        message: "请设置服务区地址",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    watch: {
        value(cur) {
            this.showModal = cur;
        },
        matchmarker(cur){
            if (cur){
                this.myForm.lon=cur.lon
                this.myForm={
                    lon:cur.lon,
                    lat:cur.lat,
                    mapSearch:cur.mapSearch
                }
            }
        }
    },
    methods: {
        onVisibleChange(val) {
            if (!val) {
                this.$emit("input", val);
            }
        },
        onMapAutoComplete(results) {
            this.mapSearchResult = results;
            this.mapSearchLoading = false;
        },
        onMapPointSelect(item) {
            this.$set(this.myForm, "provinceName", item.province);
            this.$set(this.myForm, "cityName", item.city);
            this.$set(this.myForm, "countyName", item.title);

            this.$set(
                this.myForm,
                "lat",
                parseFloat(item.point.lat).toFixed(2)
            );
            this.$set(
                this.myForm,
                "lon",
                parseFloat(item.point.lng).toFixed(2)
            );
            this.$set(this.myForm, "address", `${item.address}${item.title}`);
        },
        searchFromMap(query) {
            this.mapSearchLoading = true;
            this.$refs.mapCom.autoCompleteSearch(query);
        },
        setPlace(data) {
            this.$refs.mapCom.queryPlace(data);
        },
        onSubmit() {
            this.$refs["myForm"].validate(async valid => {
                if (valid) {
                    this.submitBtnLoading = true;
                    let fd = this.copyJson(this.myForm);
                    fd.code = this.matchmarker.code;
                    let res = await editMatchMarker(fd);
                    this.submitBtnLoading = false;
                    if (res ) {
                        this.onVisibleChange(false);
                        this.$Message.success('操作成功')
                        this.$emit('on-success')
                    }
                }
            });
        },
    },
};
</script>

<style scoped></style>
