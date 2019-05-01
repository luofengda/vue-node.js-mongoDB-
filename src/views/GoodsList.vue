<template>
  <div class="accessory-result-page accessory-page">
    <div class="container">
      <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default cur">Default</a>
        <a href="javascript:void(0)" class="price">
          Price
          <svg class="icon icon-arrow-short">
            <use xlink:href="#icon-arrow-short"></use>
          </svg>
        </a>
        <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">选择价位</a>
      </div>
      <div class="accessory-result">
        <!-- filter -->
        <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
          <dl class="filter-price">
            <dt>价钱:</dt>
            <dd>
              <a href="javascript:void(0)" :class="{'cur':priceChecked==='all'}">All</a>
            </dd>
            <dd v-for="(item,index) in priceData">
              <a
                href="javascript:void(0)"
                @click="setPriceFilter(index)"
                :class="{'cur':priceChecked==index}"
              >{{item.startPrice}} - {{item.endPrice}}</a>
            </dd>
          </dl>
        </div>

        <!-- search result accessories list -->
        <div class="accessory-list-wrap">
          <div class="accessory-list col-4">
            <ul>
              <li v-for="(item, index) in goodsData">
                <div class="pic">
                  <a href="#">
                    <img v-lazy="'/static/'+item.productImage" alt width="150px" height="100px">
                  </a>
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
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
  </div>
</template>
<script >
import axios from "axios";
export default {
  data() {
    return {
      goodsData: [],
      priceData: [
        {
          startPrice: "0.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "2000.00"
        }
      ],
      priceChecked: "all",
      //遮罩层
      overLayFlag: false,
      //控制样式
      filterBy: false
    };
  },
  created() {},
  mounted() {
    this.getData();
  },
  components: {},
  methods: {
    getData() {
      axios.get("/goods").then(res => {
        this.goodsData = res.data.result.list;
        console.log(res.data.result);
        if (res.status === 0) {
          console.log(res);
        }
      });
    },
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },
    setPriceFilter(index) {
      this.priceChecked = index;
      this.closePop();
    }
  }
};
</script>
<style scoped>
li {
  display: inline-block;
}
.price {
  color: red;
}
</style>
