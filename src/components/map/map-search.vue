<template>
    <div>
        <div  id="suggestId"/>
        <div :id="mapId" :style="`width:${mapWidth};height:${mapHeight}`"></div>
    </div>
</template>

<script>
export default {
    name: "map-search",
    props:{
      mapWidth: {
          type:String,
          default:'auto'
      },
        mapHeight: {
            type:String,
            default:'auto'
        },mapId:{
          type:String,
            default:"mapContainner"
        }
    },
    data() {
        return {
            map: null,
            autoComplete: null,
        };
    },
    methods: {
        autoCompleteSearch(value){
            this.autoComplete.search(value);
        },
        queryPlace(value){
            this.map.clearOverlays(); //清除地图上所有覆盖物
            this.mapSearch.search(value);
        }
    },
    mounted() {
        this.map = new BMap.Map(this.mapId);
        this.map.enableScrollWheelZoom();
        this.map.centerAndZoom("广州", 12);
        let _this = this;
        this.autoComplete = new BMap.Autocomplete({
            //建立一个自动完成的对象
            input: "suggestId",
            location: this.map,
            onSearchComplete(data) {
                const result = [];
                for (let index = 0; index < data.getNumPois(); index++) {
                    const item = data.getPoi(index);
                    result.push({
                        label: `${item.street}${item.streetNumber}${item.business}`,
                        value: `${item.province}${item.city}${item.district}${item.street}${item.streetNumber}${item.business}`,
                        area: `${item.province}${item.city}${item.district}`,
                    });
                }
                _this.$emit("on-auto-complete", result);
            },
        });
        this.mapSearch = new BMap.LocalSearch(this.map, {
            //智能搜索
            onSearchComplete(results) {
                if (_this.mapSearch.getStatus() === BMAP_STATUS_SUCCESS) {
                    const dataList = [];
                    for (let i = 0; i < results.getCurrentNumPois(); i++) {
                        let item = results.getPoi(i);

                        const result = {
                            address: `${item.address}${item.title}`,
                            point: item.point,
                        };
                        dataList.push(result);
                        const marker = new BMap.Marker(item.point);
                        marker.addEventListener("click", function () {
                            _this.$emit("on-marker-select", item);
                            _this.map.openInfoWindow(
                                new BMap.InfoWindow(result.address, {
                                    width: 200,
                                    height: 100,
                                    title: item.title,
                                }),
                                item.point
                            ); // 开启信息窗口
                        });
                        _this.map.addOverlay(marker); //添加标注
                    }
                    _this.map.centerAndZoom(dataList[0].point, 18);
                }
            },
        });
    },
};
</script>

<style scoped lang="less"></style>
