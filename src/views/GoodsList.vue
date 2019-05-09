<template>
  <div class="accessory-result-page accessory-page">
    <nav-header></nav-header>
    <div class="container">
      <div class="filter-nav">
        <span class="sortby">Sort by:</span>
        <a href="javascript:void(0)" class="default cur">Default</a>
        <a href="javascript:void(0)" class="price" @click="sortGoods">
          Price
          <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':sortFlag}">
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
                  <div class="price">{{item.salePrice}}</div>
                  <div class="btn-area">
                    <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
            <div
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="busy"
              infinite-scroll-distance="10"
            >
              <div class="lds-ripple" v-show="loading">
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">请先登录，否则无法添加到购物车中。</p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn-m" @click="mdShow=false">关闭</a>
      </div>
    </Modal>
    <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
        </svg>
        <span>加入购物成功！</span>
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn-m" @click="mdShowCart=false">继续购物</a>
        <router-link href="javascript:;" class="btn btn-m" to="/cart">查看购物车</router-link>
      </div>
    </Modal>
  </div>
</template>
<script >
import NavHeader from "./../components/NavHeader";
import axios from "axios";
import Modal from "./../components/Modal";
export default {
  data() {
    return {
      goodsData: [],
      //排序
      sortFlag: true,
      mdShow: false,
      mdShowCart: false,
      page: 1,
      pageSize: 4,
      busy: false,
      loading: false,
      priceData: [
        {
          startPrice: "0.00",
          endPrice: "100.00"
        },
        {
          startPrice: "100.00",
          endPrice: "500.00"
        },
        {
          startPrice: "500.00",
          endPrice: "1000.00"
        },
        {
          startPrice: "1000.00",
          endPrice: "5000.00"
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
    this.getGoodsList();
  },
  components: {
    NavHeader,
    Modal
  },
  methods: {
    /**
     * 查询数据
     */
    getGoodsList(falg) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      };
      (this.loading = true),
        axios
          .get("/goods/list", {
            params: param
          })
          .then(res => {
            this.loading = false;
            if (falg) {
              this.goodsData = this.goodsData.concat(res.data.result.list);
              //  没有数据的时候 禁止滚动
              if (res.data.result.count == 0) {
                this.busy = true;
              } else {
                this.busy = false;
              }
            } else {
              this.goodsData = res.data.result.list;
              this.busy = false;
            }
          });
    },
    /**
     * 排序
     */
    sortGoods() {
      this.sortFlag = !this.sortFlag;
      this.page = 1;
      this.getGoodsList();
    },
    /**
     * 滚动代码
     */
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getGoodsList(true);
      }, 800);
    },
    showFilterPop() {
      this.filterBy = true;
      this.overLayFlag = true;
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false;
    },

    /**
     *价格过滤
     */
    setPriceFilter(index) {
      this.priceChecked = index;
      this.page = 1;
      this.getGoodsList();
      this.closePop();
    },
    /**
     * 加入购物车
     */
    addCart(productId) {
      axios
        .post("/goods/addCart", {
          productId: productId
        })
        .then(res => {
          console.log(res.data);
          if (res.data.status == 0) {
            this.mdShowCart = true;
          } else {
            this.mdShow = true;
          }
        });
    },
    closeModal() {
      this.mdShow = false;
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

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid rgb(148, 173, 219);
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 28px;
    left: 28px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: -1px;
    left: -1px;
    width: 58px;
    height: 58px;
    opacity: 0;
  }
}
.sort-up {
  transform: rotate(180deg);
  transition: all 0.3s ease-out;
}
.btn:hover {
  background-color: #ffe5e6;
  transition: all 0.3s ease-out;
}
</style>
