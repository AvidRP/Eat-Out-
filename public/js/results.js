$(document).ready(function(){
  $(".detailInfo").hide();
  $(".infodiv").click(function() {
    $(this).find(".detailInfo").toggle("slow");
  })
})
