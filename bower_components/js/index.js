$(function(){
    var ctx = $('#canvas').get(0).getContext('2d');
    var canvasS =600;
    var row = 15;
    var blockS = canvasS/row;
    var startRadius=3
    $('#canvas').get(0).width = canvasS;
    $('#canvas').get(0).height= canvasS;
    //画棋盘
    var draw = function(){

        var jiangge = blockS/2 +0.5;
        var lineWidth = canvasS - blockS;

        //画横线
        ctx.save();
        ctx.beginPath();
        ctx.translate(jiangge,jiangge);
        ctx.moveTo(0,0);
        ctx.lineTo(lineWidth,0);
        for(var i=0;i<row;i++){
            ctx.translate(0,blockS);
            ctx.moveTo(0,0);
            ctx.lineTo(lineWidth,0);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        //画竖线
        ctx.save();
        ctx.beginPath();
        ctx.translate(jiangge,jiangge);
        ctx.moveTo(0,0);
        ctx.lineTo(0,lineWidth);
        for(var i=0;i<row;i++){
            ctx.translate(blockS,0);
            ctx.moveTo(0,0);
            ctx.lineTo(0,lineWidth);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        //画圆点
        var point=[3.5*blockS+0.5,11.5*blockS+0.5];

        for(var i=0;i<2;i++){
            for(var j=0;j<2;j++){
                var x=point[i];
                var y=point[j];
                ctx.save();
                ctx.beginPath();
                ctx.translate(x,y);
                ctx.arc(0,0,startRadius,0,(Math.PI/180)*360);
                ctx.fill();
                ctx.closePath();
                ctx.restore();

            }
        }
        //中心点
        ctx.save();
        ctx.beginPath();
        ctx.translate(7.5*blockS+0.5,7.5*blockS+0.5);
        ctx.arc(0,0,startRadius,0,(Math.PI/180)*360);
        ctx.fill();
        ctx.closePath();
        ctx.restore();

    }
    draw();
    //棋子的样式以及落子的音乐
    var drop=function(qizi){
        ctx.save();
        ctx.translate((qizi.x+0.5)*blockS,(qizi.y+0.5)*blockS);
        ctx.beginPath();
        ctx.arc(0,0,15,0,(Math.PI/180)*360);
        if(qizi.color===1){
            var rd = ctx.createRadialGradient(0,0,2,0,0,15);
            rd.addColorStop(0,"#6C6C6C");
            rd.addColorStop(1,"#010101");
            ctx.fillStyle = rd;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 3;
            ctx.shadowColor = 'rgba(47,47,47,.85)';
            $("#black_play").get(0).play()
        }else{
            var rd = ctx.createRadialGradient(0,-5,2,0,0,15);
            rd.addColorStop(0.1,'#FFF');
            rd.addColorStop(0.35,'#F1F1F1');
            rd.addColorStop(0.5,'#E9E5E5');
            rd.addColorStop(0.7,'#E0DBE0');
            rd.addColorStop(1,'#C6C3C3');
            ctx.fillStyle = rd;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 3;
            ctx.shadowColor = 'rgba(47,47,47,0.74)';
            $('#white_play').get(0).play();
        }
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    var kaiguan=true;
    var step=0;
    var all ={};

      panduan=function (qizi) {
          var shuju={};
              $.each(all,function (k,v) {
                if (v.color===qizi.color){
                    shuju[k]=v;
                    // console.log(shuju[k])
                }

              })
             var shu=1,hang=1,zuoxie=1,youxie=1
             var tx,ty;
              tx=qizi.x
              ty=qizi.y
             //判断竖列有无棋子
             while ( shuju [ tx + '-' + (ty + 1) ]){
                 shu ++;ty++;
             }
             tx=qizi.x;ty=qizi.y
             while (shuju[tx +'-'+(ty-1)]){
                 shu++;ty--
             }
             //判断横列有无棋子
             tx=qizi.x;ty=qizi.y
             while (shuju[(tx+1)+'-'+ty]){
               hang++;tx++
             }
             tx=qizi.x;ty=qizi.y
             while( shuju[ (tx-1) + '-' + ty ] ){
                 hang++;tx--;
             }
            //判断左斜有无棋子
             tx=qizi.x;ty=qizi.y
             while (shuju[(tx-1)+'-'+(ty-1)]){
               zuoxie++;tx--;ty--
             }
             tx=qizi.x;ty=qizi.y
             while (shuju[(tx+1)+'-'+(ty+1)]){
                 zuoxie++;tx++;ty++
             }
             //判断右斜有无棋子
             tx = qizi.x ; ty = qizi.y;
             while( shuju[ (tx+1) + '-' + (ty-1) ] ){
                 youxie++;tx++;ty--;
             }
             tx = qizi.x ; ty = qizi.y;
             while( shuju[ (tx-1) + '-' + (ty+1) ] ){
                 youxie++;tx--;ty++;
             }
          if(hang>=5 || youxie>=5 || zuoxie>=5 || shu>=5){
              return true;//赢了

          }

     }

    function tip(){

        $('.tips').animate({top:"200px"},'slow','linear',function(){
            $(this).animate({top:"-=200px"},'slow')
        })
    }
    




    $('#canvas').on('click',function(e){
        var x = Math.floor( e.offsetX/blockS);
        var y = Math.floor( e.offsetY/blockS);
        if( all[ x + '-' + y ] ){
            return;
        }
        if( kaiguan ){
            var qizi = {x:x,y:y,color:1,step:step++};
            drop(qizi);
            kaiguan = false;
            if(panduan(qizi)){
             $(".mask").show().find("#tishi").text("黑方赢")
                tip()
            }

        }else{
            var qizi = {x:x,y:y,color:0,step:step++};
            drop(qizi);
            kaiguan = true;
            if(panduan(qizi)){
                $(".mask").show().find("#tishi").text("白方赢")
                tip()
            }
        }
        all[ x + '-' + y ] = qizi;
    })
    $("#begin").on('click',function () {

        $(".mask").hide();
        ctx.clearRect(0,0,600,600);
        draw();
        all={}
        kaiguan=true;
        step=1

    })
    $("#qipu").on('click',function () {
        $(".misk").hide()
        $("#save").show()
        ctx.save()
        for(var i in all){
            if(all[i].color==1){
                ctx.fillStyle="#fff"
            }else{
                ctx.fillStyle="black"
            }
            ctx.textAlign='center'
            ctx.textBaseline='middle'
            ctx.fillText(all[i].step,
                (all[i].x+0.5)*blockS,
                (all[i].y+0.5)*blockS);
        }
        ctx.restore()
        var image=$('#canvas').get(0).toDataURL('image/jpg',1)
        $('#save').attr('href',image)
        $('#save').attr('download','qipu.png')
    })
    $('#close').on('click',function () {

        $(".mask").hide()

    })
    $('.mask').on('click',function () {
        $(this).hide()
    })
   $('.tips').on('click',false)

// 背景图
    var img=new Image()
    img.src='../../img/1.jpg'
    img.onload=function () {
    var imgs=ctx.createPattern(img,'no-repeat')
        ctx.fillStyle=imgs
        ctx.drawImage(0,0,600,600)
    }

})