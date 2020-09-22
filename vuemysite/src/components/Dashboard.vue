<template>
<div>
    <Navbar></Navbar>
    <div class="container-fluid">
      <div class="row">
          <Sidebar></Sidebar>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
            <p>我是後台介面</p>
        </main>
      </div>
    </div>
</div>
</template>

<script>
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default {
    components:{
        Navbar,
        Sidebar
    }
}
</script>>