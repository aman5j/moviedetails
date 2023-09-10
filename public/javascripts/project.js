$(document).ready(function(){
    $.getJSON("/movie/fetch_all_states",function(data){
        var data=data.result;
        data.map((item,i)=>{
            $("#stateid").append($('<option>').text(item.statename).val(item.stateid));
        })
    })

    $("#stateid").change(function(){
        $.getJSON("/movie/fetch_all_cities", {stateid:$('#stateid').val()}, function(data){
            var data=data.result;
            $("#cityid").empty();
            $("#cityid").append($('<option>').text("-Select City-"))
            data.map((item,i)=>{
                $("#cityid").append($('<option>').text(item.cityname).val(item.cityid));
            })
        })
    })

    $.getJSON("/movie/fetch_all_cinemas",function(data){
        var data=data.result;
        data.map((item,i)=>{
            $('#cinemaid').append($('<option>').text(item.cinemaname).val(item.cinemaid));
        })
    })  

    $('#cinemaid').change(function(){
        $.getJSON("/movie/fetch_all_screens",{cinemaid:$('#cinemaid').val()}, function(data){
            var data=data.result;
            $('#screenid').empty();
            $('#screenid').append($('<option>').text('-Select Screen-'));
            data.map((item,i)=>{
                $('#screenid').append($('<option>').text(item.screenname).val(item.screenid));
            })
        })
    })
})