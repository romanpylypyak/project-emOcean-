<template>
    <div>
        <div id="errorpage">
            <i class="far fa-frown"></i>
            <br>
            <h6>404 Page not found</h6>
            <p class="error-info">Additional info: Error during route processing</p>
        </div>
    </div>
</template>

<script>
export default {

}
</script>
<style lang="scss" scoped>
*{
  margin: 0;
  padding: 0;
}
#errorpage{
  margin:20%;
  display:flex;
  justify-content: center;
  align-items: center;
  text-align:center;
  flex-direction: column;
  color:#333;
  i{
    font-size: 8em;
    color: #ccc;
    margin:5%;
  }
  .error-info{
    color:#777;
  }
}
</style>
