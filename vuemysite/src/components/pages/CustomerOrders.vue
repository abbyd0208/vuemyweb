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
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addToCart(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem ===item.id"></i>
                        加到購物車
                    </button>
                    </div>
                </div>
            </div>
        </div>
        <hr>

        <div class="row" style="max-width:500px; margin:0 auto;">
        <table class="table" >
                <thead>
                    <th></th>
                    <th>品名</th>
                    <th>數量</th>
                    <th>單價</th>
                </thead>
                <tbody>
                    <tr v-for="item in cart.carts" :key="item.id">
                    <td class="align-middle">
                        <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCarItem(item.id)">
                        <i class="far fa-trash-alt"></i>
                        </button>
                    </td>
                    <td class="align-middle">
                        {{ item.product.title }}
                        <div class="text-success" v-if="item.coupon">
                        已套用優惠券
                        </div>
                    </td>
                    <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                    <td class="align-middle text-right">{{ item.final_total }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                    <td colspan="3" class="text-right">總計</td>
                    <td class="text-right">{{ cart.total }}</td>
                    </tr>
                    <tr v-if="cart.total !=  cart.final_total">
                    <td colspan="3" class="text-right text-success">折扣價</td>
                    <td class="text-right text-success">{{ cart.final_total }}</td>
                    </tr>
                </tfoot>
                </table>
                <div class="input-group mb-3 input-group-sm">
                <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" @click="addCouponCode" type="button">
                    套用優惠碼
                    </button>
                </div>
                </div>
        </div>

        <!-- 購物表單 -->
         <!-- <div class="my-5 row justify-content-center">
            <form class="col-md-6">
                <div class="form-group">
                <label for="useremail">Email</label>
                <input type="email" class="form-control" name="email" id="useremail"
                    v-model="form.user.email" placeholder="請輸入 Email" required>
                <span class="text-danger"></span>
                </div>
            
                <div class="form-group">
                <label for="username">收件人姓名</label>
                <input type="text" class="form-control" name="name" id="username"
                    v-model="form.user.name" placeholder="輸入姓名">
                <span class="text-danger"></span>
                </div>
            
                <div class="form-group">
                <label for="usertel">收件人電話</label>
                <input type="tel" class="form-control" id="usertel" v-model="form.user.tel" placeholder="請輸入電話">
                </div>
            
                <div class="form-group">
                <label for="useraddress">收件人地址</label>
                <input type="text" class="form-control" name="address" id="useraddress" v-model="form.user.address"
                    placeholder="請輸入地址">
                <span class="text-danger">地址欄位不得留空</span>
                </div>
            
                <div class="form-group">
                <label for="comment">留言</label>
                <textarea name="" id="comment" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
                </div>
                <div class="text-right">
                <button class="btn btn-danger">送出訂單</button>
                </div>
            </form>
        </div> -->
        
        <!-- 查看詳細產品的 modal -->
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
                        <!-- 將產品數量掛載在單筆資料的product上 -->
                        <select class="form-control mt-3" name="" v-model="product.num">
                            <option :value="num" v-for="num in 10" :key="num">
                                選購{{num}} {{product.unit}}
                            </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3">
                            小計 <strong>{{product.num * product.price}}價格</strong>元
                        </div>
                        <button type="button" class="btn btn-primary" @click="addToCart(product.id, product.num)">加到購物車</button>
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
            },
            cart:{},
            coupon_code:''
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
        },
        addToCart(id,qty = 1){ //加入購物車
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/cart`;
            vm.status.loadingItem = id;  //打開loading
            
            const cart = {
                product_id:id,
                qty
            }

            this.$http.post(api,{data:cart}).then((response) => {
                console.log(response.data);
                $('#productModal').modal('hide');
                vm.getCarts();
                vm.status.loadingItem = '';  //關閉loading
            });
        },
        getCarts(){ //取得購物車列表
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/cart`;
         
            this.$http.get(api).then((response) => {
                console.log(response.data);
                vm.cart = response.data.data
            });
        },
        removeCarItem(id){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/cart/${id}`;
            vm.status.loadingItem = id;  //打開loading

            this.$http.delete(api).then((response) => {
                console.log(response.data);
                vm.getCarts();
                vm.status.loadingItem = '';  //關閉loading
            });
        },
        addCouponCode(){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/coupon`;
           
            const coupon = {
                code: vm.coupon_code
            }
            this.$http.post(api,{data:coupon}).then((response) => {
                console.log(response.data);
                vm.getCarts();
                vm.status.loadingItem = '';  //關閉loading
            });
        }
    },
    created(){
        this.getProducts()
        this.getCarts()
    }
}
</script>