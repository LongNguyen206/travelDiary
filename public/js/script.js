$(document).ready(function(){
  $(".dropdown-trigger").dropdown();
  $('.sidenav').sidenav();
  $('.datepicker').datepicker({
    format: 'dd mmm yyyy'
  });
  $('select').formSelect();
});

tinymce.init({ selector:'textarea' });