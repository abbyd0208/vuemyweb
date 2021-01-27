<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="row">
             <div class="col-md-4 mb-4" v-for="(item) in products" :key="item.id">
                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; background-position: center"
                    :style="{backgroundImage:`url(${item.imageUrl})`}"
                    >
                    </div>
                    <div class="card-body">
                        <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
                        <h5 class="card-title">
                            <a href="#" class="text-dark">{{item.title}}</a>
                        </h5>
                        <p class="card-text">{{item.content}}</p>
                        <div  class="d-flex justify-content-between align-items-baseline">
                            <div class="h5" v-if="!item.price"> {{item.origin_price | currency}}</div>
                            <del class="h6" v-if="item.price">原價 {{item.origin_price | currency}} 元</del>
                            <div class="h5" v-if="item.price" >現在只要 {{item.price | currency}} 元</div>
                        </div>
                    </div>
                    <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                        <i  class="fas fa-spinner fa-spin" v-if="status.loadingItem ===item.id"></i>
                        查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem ===item.id"></i>
                        加到購物車
                    </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 新增產品的 modal -->
        <div class="modal fade" id="productModal">
            <div class="modal-dialog modal-lg" >
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">{{product.title}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img class="img-fluid" :src="product.imageUrl" alt="">
                        <blockquote>
                            <p class="mb-0">{{product.content}}</p>
                            <footer class="blockquote-footer text-right">{{product.description}}</footer>
                        </blockquote>
                        <div  class="d-flex justify-content-between align-products-baseline">
                            <div class="h5" v-if="!product.price">{{product.origin_price}}</div>
                            <del class="h6" v-if="product.price">原價{{product.origin_price}}元</del>
                            <div class="h5" v-if="product.price">現在只要 {{product.price}} 元</div>
                        </div>
                        <select class="form-control mt-3" name="" id="">
                            <option value="1">選購1件</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3">
                            小計 <strong>價格</strong>元
                        </div>
                        <button type="button" class="btn btn-primary">加到購物車</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            products:[],
            isLoading:false,
            product:{},
            status:{
                loadingItem:''
            }
        }
    },
    methods:{
        getProducts(){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/products`;
            vm.isLoading = true;  //打開loading
            this.$http.get(api).then((response) => {
                console.log(response.data);
                vm.products = response.data.products;
                vm.isLoading = false;  //關閉loading
            });
        },
        getProduct(id){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/product/${id}`;
            vm.status.loadingItem = id;  //打開loading
            this.$http.get(api).then((response) => {
                console.log(response.data);
                $('#productModal').modal('show')
                vm.product = response.data.product;
                 vm.status.loadingItem = '';  //關閉loading
            });
        }
    },
    created(){
        this.getProducts()
    }
}
</script>