import Vue from 'vue';
Vue.prototype.$bus = new Vue();

// Message 
// 使用方式：
// vm.$bus.$emit('message:push',message,state)
// message (String):訊息內容
// state (String):Alert的樣式