<template>
    <div>
        我是內容123
    </div>
</template>

<script>
export default {
    data(){
        return{
            products:[]
        }
    },
    methods:{
        getProducts(){
            const vm = this;
           const api = `${process.env.APIPATH}/api/${process.env.COUSTOMPATH}/products`;
            this.$http.get(api).then((response) => {
              console.log(response.data.products);
              vm.products = response.data.products
            });
        }
    },
    created(){
        this.getProducts();
    }
}
</script>