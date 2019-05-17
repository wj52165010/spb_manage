<template>
  <div class="EW_Map" :id="mapId">
      <v-table :listen="data" ref="listTable" :blnLoading="true">
          <v-table-header>
              <v-table-column :width="200">
                  <span @click="test()">dsfdsfds</span>
              </v-table-column>
              <v-table-column >
                  dsfdsfds
              </v-table-column>
          </v-table-header>
          <v-table-body>
              <template v-for="d in data">
                <v-table-row @click="blnshow=true">
                    <v-table-column>213213</v-table-column>
                    <v-table-column>213213</v-table-column>
                </v-table-row>
                <v-table-row>
                  <div style="height:100px;padding:10px;" v-if="blnshow">

                    <v-table :listen="childData" :base="true">
                          <v-table-header :style="{'background-color':'transparent','color':'black'}">

                              <v-table-column :width="150">标题</v-table-column>
                              <v-table-column :width="150">标题</v-table-column>
                          </v-table-header>

                          <v-table-body>
                              <v-table-row v-for="c in childData">
                                  <v-table-column :width="150">推送者</v-table-column>
                                  <v-table-column :width="150">推送者</v-table-column>
                              </v-table-row>
                          </v-table-body>
                      </v-table>
                  </div>
                </v-table-row>
              </template>
          </v-table-body>
      </v-table>
  </div>
</template>

<script>

import map from '@/wraplib/Map/map'
import {AlarmMarker} from '@/wraplib/Map/marker' 

import  EWMapInfo from './EW_Map_Info'


import themeMixin from '@/mixins/themeMixin'
export default {
  name: 'EW_Map',
  mixins:[themeMixin],
  components: {},
  data(){
    return {
      mapId:_t.guid(),
      mapIns:null,
      data:[1,2,3,5,6,6,2,7,7,8,9,3], 
      blnshow:false, 
      childData:[1,2],
    };
  },
  mounted(){
   //this.initMap();
  },
  methods:{
    initMap(){
        let s=this;
        var data = [
            map.Point(116.297047,39.979542),
            map.Point(116.321768,39.88748),
            map.Point(116.494243,39.956539)
        ];

        //let point=map.Point(116.400244,39.92556);
        this.mapIns =new map(this.mapId,data);

        for(let d in data){
          let marker=new AlarmMarker(this.mapIns,data[d],230,100,[{
            content:'<EWMapInfo />',
            store:s.$store,
            components:{EWMapInfo}
          },
          {
            content:'<EWMapInfo />',
            components:{EWMapInfo}
          }]);
          marker.add();
          if(d==0){
            marker.remove();
          }
        }
    },
    test(){
      this.Theme('blue')
    }
  }
}
</script>

<style lang="less" scoped>
  .EW_Map{width:100%;height:100%;}
</style>