<template>
    <div>
       <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd><a href="javascript:void(0)">All</a></dd>
          <dd>
            <a href="javascript:void(0)">0 - 100</a>
          </dd>
        </dl>
      </div>
      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="(item, index) in data" >
                <div class="pic">
                <a href="#"><img v-bind:src="'/static/'+item.prodcutImg" alt="" width="150px" height="100px"></a>
              </div>
              <div class="main">
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.prodcutPrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m">加入购物车</a>
                </div>
              </div>
            </li>
           
          </ul>
        </div>
      </div>
    </div>
    </div>
</template>
<script >
import axios from "axios";
export default {
  data() {
    return {
      data:[]
    };
  },
  created() {},
  mounted() {
    this.getData();
  },
  components: {},
  methods: {
    getData() {
      axios.get("/server/goods").then(res => {
        this.data=res.data.result
        console.log(res.data.result);
        if (res.status===0) {
          console.log(res);
          
        }
      });
    }
  }
};
</script>
<style scoped>
li {
  display: inline-block;
}
</style>
