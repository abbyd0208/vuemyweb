<template>
    <div>
         <loading :active.sync="isLoading"></loading>

        <div class="text-right"><button class="btn btn-primary" @click="openModal(true)">建立新的商品</button></div>
        <table class="table mt-4">
            <thead>
                <th width="120">分類</th>
                <th>產品名稱</th>
                <th width="120">原價</th>
                <th width="120">售價</th>
                <th width="100">是否啟用</th>
                <th width="80">編輯</th>
                <th width="80">刪除</th>
            </thead> 
            <tbody>
                <tr v-for="(item) in products" :key="item.id">
                    <td>{{item.category}}</td>
                    <td>{{item.title}}</td>
                    <td class="text-right">{{item.origin_price | currency}}</td>
                    <td class="text-right">{{item.price | currency}}</td>
                    <td>
                        <span class="text-success" v-if="item.is_enabled">啟用</span>
                        <span class="text-success" v-else>啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
                    </td>
                    <td>
                        <button class="btn btn-outline-info btn-sm" @click="openDelModal(item)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item"  :class="{'disabled':!pagination.has_pre}">
                <a class="page-link" :href="pagination.current_page -1"  @click.prevent="getProducts(pagination.current_page - 1)">Previous</a>
                </li>
            <li class="page-item" v-for="item in pagination.total_pages" :key="item"
                :class="{'active':pagination.current_page == item}" >
                <a class="page-link" href="#"  @click.prevent="getProducts(item)">{{item}}</a></li>
            <li class="page-item"  :class="{'disabled':!pagination.has_next}" >
                <a class="page-link" href="#"  @click.prevent="getProducts(pagination.current_page + 1)">Next</a>
            </li>
        </ul>
        </nav>

        <!-- 新增產品的 modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>新增產品</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                    <div class="col-sm-4">
                        <div class="form-group">
                        <label for="image">輸入圖片網址</label>
                        <input type="text" v-model="tempProducts.imageUrl"  class="form-control" id="image"
                            placeholder="請輸入圖片連結">
                        </div>
                        <div class="form-group">
                        <label for="customFile">或 上傳圖片
                            <i class="fas fa-spinner fa-spin" v-if="isLoading"></i>
                        </label>

                        <input type="file" id="customFile" class="form-control"
                            ref="files" @change="uploadfile">
                        </div>
                        <img class="img-fluid" :src="tempProducts.imageUrl" alt="">
                    </div>
                    <div class="col-sm-8">
                        <div class="form-group">
                        <label for="title" >標題</label>
                        <input type="text" v-model="tempProducts.title" class="form-control" id="title"
                            placeholder="請輸入標題">
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="category">分類</label>
                            <input type="text" v-model="tempProducts.category" class="form-control" id="category"
                            placeholder="請輸入分類">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">單位</label>
                            <input type="unit" v-model="tempProducts.unit" class="form-control" id="unit"
                            placeholder="請輸入單位">
                        </div>
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                        <label for="origin_price">原價</label>
                            <input type="number"  v-model="tempProducts.origin_price"  class="form-control" id="origin_price"
                            placeholder="請輸入原價">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">售價</label>
                            <input type="number" v-model="tempProducts.price" class="form-control" id="price"
                            placeholder="請輸入售價">
                        </div>
                        </div>
                        <hr>

                        <div class="form-group">
                        <label for="description">產品描述</label>
                        <textarea type="text" v-model="tempProducts.description"  class="form-control" id="description"
                            placeholder="請輸入產品描述"></textarea>
                        </div>
                        <div class="form-group">
                        <label for="content">說明內容</label>
                        <textarea type="text" v-model="tempProducts.content" class="form-control" id="content"
                            placeholder="請輸入產品說明內容"></textarea>
                        </div>
                        <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox"
                            id="is_enabled" v-model="tempProducts.is_enabled" 
                            :true-value="1"
                            :false-value="0">
                            <label class="form-check-label" for="is_enabled">
                            是否啟用
                            </label>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
                </div>
                </div>
            </div>
        </div>

       <!-- 刪除產品的 modal -->
       <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>刪除產品</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    是否刪除 <strong class="text-danger">{{ tempProducts.title }}</strong> 商品(刪除後將無法恢復)。
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-danger" @click="deleteProduct">確認刪除</button>
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
            tempProducts:{},
            isNew:false,
            isLoading:false,
            pagination:{}
        }
    },
    methods:{
        getProducts(page = 1){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/products?pages=${page}`;
            vm.isLoading = true;  //打開loading
            this.$http.get(api).then((response) => {
              console.log(response.data);
              vm.products = response.data.products
              vm.isLoading = false;  //關閉loading
              vm.pagination = response.data.pagination
            });
        },
        openModal(isNew,item){
            if(isNew){
                this.tempProducts = {}
                isNew = true
            }else{
                this.tempProducts = Object.assign({},item)
                isNew = false
            }
            $('#productModal').modal('show');
        },
        updateProduct(){
            const vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/admin/product`;
            let postMethos = 'post';

            // 編輯時使用的API
            if(!vm.isNew){
                api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/admin/product/${vm.tempProducts.id}`;
                postMethos = 'put';
            }

            this.$http[postMethos](api,{data:vm.tempProducts}).then((response) => {
                console.log(response.data);
                if(response.data.success){
                    $('#productModal').modal('hide');
                    vm.getProducts()
                }else{
                    $('#productModal').modal('hide');
                    vm.getProducts()
                    console.log('新增產品失敗')
                }
            });
        },
        openDelModal(item){
            this.tempProducts = item;
            $("#delProductModal").modal('show');
        },
        deleteProduct(){
            let vm = this;
            let api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/admin/product/${vm.tempProducts.id}`;
            
            this.$http.delete(api).then((response) => {
             
                if(response.data.success){
                    $("#delProductModal").modal("hide");
                    console.log(response.data.message)
                    vm.getProducts()
                }else{
                    vm.getProducts()
                    console.log(response.data.message)
                }
            });

        },
        uploadfile(){
            
            //取得檔案並且加入到formData內
            let uploadFile = this.$refs.files.files[0];
            let formData = new FormData();
            formData.append('file-to-upload', uploadFile);
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/admin/upload`;
            this.isLoading = true;
            this.$http.post(api , formData ,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
              console.log(response.data);

                if(response.data.success){
                    this.isLoading = false;
                    vm.$set(vm.tempProducts,'imageUrl',response.data.imageUrl)
                }else{
                     this.$bus.$emit('message:push',response.data.message,'danger')
                }
            });
        }   
    },
    created(){
        this.getProducts();
       
    }
}
</script>