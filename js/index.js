$(function() {
    window.onload = function() {
        // 获取棋盘对象
        var pan = $(".pan")[0];
        // 棋子黑白切换
        var play = true;
        // 所有棋数组x,y
        var allArr = [];
        // 赢棋数组
        var win = [];
        // 赢法编号
        var count = 0;
        // 白棋赢法数组
        var baiWin = [];
        // 黑棋赢法数组
        var heiWin = [];
        // 游戏是否结束
        var over = false;
        // 黑棋悔棋数组
        var heiBackList = [];
        // 白棋悔棋数组
        var baiBackList = [];
        // 悔棋次数，最多三次
        const BACK_COUNT = 3;
        // 白棋记录win数组状态
        // var baiWinStatus = [];
        // 黑棋记录win数组状态
        // var heiWinStatus = [];
        // 白棋dom数组
        var baiTargetList = [];
        // 黑棋dom数组
        var heiTargetList = [];
        // 白棋count数组
        var baiCountList = [];
        // 黑棋count数组
        var heiCountList = [];

        // 记录黑棋悔棋baiWinList
        var heiReBackList = [];
        // 记录白棋悔棋baiWinList
        var baiReBackList = [];
        //  记录白棋悔棋dom
        var baiReTargetList = [];
        //  记录黑棋悔棋dom
        var heiReTargetList = [];

        // 白棋悔棋count数组
        var baiReCountList = [];
        // 黑棋悔棋count数组
        var heiReCountList = [];

        // 悔棋去掉的数组数据
        var allReArr = [];
        // 没有悔棋的情况下不能撤销悔棋
        var canRevoke = false;


        // 所有棋子布局在棋盘上
        for (x = 0; x < 15; x++) {
            for (y = 0; y < 15; y++) {
                let li = document.createElement("li");
                li.style.left = (x * 35) - 13 + "px";
                li.style.bottom = (y * 35) - 13 + "px";
                //给每个棋子标记编号x，y
                li.setAttribute("data-index", `${x},${y}`);
                pan.appendChild(li);
            }
        }

        //把赢棋数组设置为三维数组(i为x，j为y，k为赢棋编号)
        for (var i = 0; i < 15; i++) {
            win[i] = [];
            for (var j = 0; j < 15; j++) {
                win[i][j] = [];
            }
        }

        //横线赢法 判断横轴是否连成5子，判断成功
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 11; j++) {
                for (var k = 0; k < 5; k++) {
                    win[j + k][i][count] = true;
                }
                count++;
            }
        }
        //竖线赢法
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 11; j++) {
                for (var k = 0; k < 5; k++) {
                    win[i][j + k][count] = true;
                }

                count++;
            }
        }
        //左斜线赢法
        for (var i = 0; i < 11; i++) {
            for (var j = 0; j < 11; j++) {
                for (var k = 0; k < 5; k++) {
                    win[i + k][j + k][count] = true;
                }

                count++;
            }
        }
        //右斜线赢法
        for (var i = 4; i < 15; i++) {
            for (var j = 0; j < 11; j++) {
                for (var k = 0; k < 5; k++) {
                    win[i - k][j + k][count] = true;
                }

                count++;
            }
        }


        //初始化白棋和黑棋的赢法数组
        for (var i = 0; i < count; i++) {
            baiWin[i] = 0;
            heiWin[i] = 0;
        }

        //改变棋子颜色，将棋子信息插入
        function bai(e) {
            baiReBackList = [];
            heiReBackList = [];
            canRevoke = false;
            // 获取当前棋子对象
            let target = e.target || window.event.srcElement;
            // 当前棋子背景颜色设置为白色
            target.style.background = "#fff";
            if(baiTargetList.length<BACK_COUNT){
                baiTargetList.push(target)
            }else{
                baiTargetList.shift();
                baiTargetList.push(target)
            }
            // 获取当前白色棋子的坐标
            var baiindex = target.getAttribute("data-index");
            allArr.push(baiindex);
            // 获取当前白色棋子的X坐标
            var baiX = baiindex.split(",")[0];
            // 获取当前白色棋子的Y坐标
            var baiY = baiindex.split(",")[1];
            let countList = [];
            for (var i = 0; i < count; i++) {
                if (win[baiX][baiY][i]) {
                    baiWin[i]++;
                    countList.push(i);
                    if (baiWin[i] == 5) {
                        alert("白棋获胜")
                        over = true;
                        restart()
                    }
                }
            }
            if(baiCountList.length<BACK_COUNT){
                baiCountList.push(countList)
            }else{
                baiCountList.shift();
                baiCountList.push(countList)
            }
            if(baiBackList.length<BACK_COUNT){
                baiBackList.push(baiWin)
            }else{
                baiBackList.shift();
                baiBackList.push(baiWin)
            }
        }

        // 黑棋子
        function hei(e) {
            baiReBackList = [];
            heiReBackList = [];
            canRevoke = false;
            let target = e.target || window.event.srcElement;
            target.style.background = "#000";
            if(heiTargetList.length<BACK_COUNT){
                heiTargetList.push(target)
            }else{
                heiTargetList.shift();
                heiTargetList.push(target)
            }
            var heiindex = target.getAttribute("data-index");
            allArr.push(heiindex);
            var heiX = heiindex.split(",")[0];
            var heiY = heiindex.split(",")[1];
            let countList = [];
            for (var i = 0; i < count; i++) {
                if (win[heiX][heiY][i]) {
                    heiWin[i]++;
                    countList.push(i);
                    if (heiWin[i] == 5) {
                        alert("黑棋获胜");
                        over = true;
                        restart()
                    }
                }
            }
            if(heiCountList.length<BACK_COUNT){
                heiCountList.push(countList)
            }else{
                heiCountList.shift();
                heiCountList.push(countList)
            }
            if(heiBackList.length<BACK_COUNT){
                heiBackList.push(heiWin)
            }else{
                heiBackList.shift();
                heiBackList.push(heiWin)
            }
        }
        //点击悔棋
        $("#back").click(function () {
            if(over){
                alert('对局已结束');
                return
            }
            if(play){
                baiBack();
            }else{
                heiBack();
            }
        });

        //点击撤销悔棋
        $("#reBack").click(function () {
            if(over){
                alert('对局已结束');
                return
            }
            if(play){
                baiReBack();
            }else{
                heiReBack();
            }
        });

        function baiReBack() {
            console.log('白方撤销悔棋');
            console.log(baiReBackList,'baiReBackList')
            console.log(heiReBackList,'heiReBackList')
            if(heiReBackList.length>0){
                heiBackList.push(heiReBackList.pop());
            }else{
                if(canRevoke==false){
                    alert('已重新落子不可撤销');
                    return;
                }
                alert('不可撤销');
                return
            }
            if(baiReBackList.length>0){
                baiBackList.push(baiReBackList.pop());
            }
            if(baiReTargetList.length>0){
                let target = baiReTargetList.pop();
                target.style.background = '#fff';
                allArr.push(target.getAttribute("data-index"));
                baiTargetList.push(target);
            }
            if(heiReTargetList.length>0){
                let target2 = heiReTargetList.pop();
                target2.style.background = '#000';
                allArr.push(target2.getAttribute("data-index"));
                heiTargetList.push(target2);
            }
            if(heiReCountList.length>0){
                let countList = heiReCountList.pop();
                for(let i=0;i<countList.length;i++){
                    heiWin[countList[i]] ++;
                }
                heiCountList.push(countList);
            }
            if(baiReCountList.length>0){
                let countList2 = baiReCountList.pop();
                for(let i=0;i<countList2.length;i++){
                    baiWin[countList2[i]] ++;
                }
                baiCountList.push(countList2);
            }
            // if(allReArr.length>0){
            //     let tmpArr = allReArr.pop();
            //     allArr.push(tmpArr[1]);
            //     allArr.push(tmpArr[0]);
            // }
        }

        function heiReBack() {
            console.log('黑方撤销悔棋');
            console.log(baiReBackList,'baiReBackList')
            console.log(heiReBackList,'heiReBackList')
            if(baiReBackList.length>0){
                baiBackList.push(baiReBackList.pop());
            }else{
                if(canRevoke==false){
                    alert('已重新落子不可撤销');
                    return;
                }
                alert('不可撤销');
                return
            }
            if(heiReBackList.length>0){
                heiBackList.push(heiReBackList.pop());
            }
            if(baiReTargetList.length>0){
                let target = baiReTargetList.pop();
                target.style.background = '#fff';
                allArr.push(target.getAttribute("data-index"));
                baiTargetList.push(target);
            }
            if(heiReTargetList.length>0){
                let target2 = heiReTargetList.pop();
                target2.style.background = '#000';
                allArr.push(target2.getAttribute("data-index"));
                heiTargetList.push(target2);
            }
            if(heiReCountList.length>0){
                let countList = heiReCountList.pop();
                for(let i=0;i<countList.length;i++){
                    heiWin[countList[i]] ++;
                }
                heiCountList.push(countList);
            }
            if(baiReCountList.length>0){
                let countList2 = baiReCountList.pop();
                for(let i=0;i<countList2.length;i++){
                    baiWin[countList2[i]] ++;
                }
                baiCountList.push(countList2);
            }
            // if(allReArr.length>0){
            //     let tmpArr = allReArr.pop();
            //     allArr.push(tmpArr[1]);
            //     allArr.push(tmpArr[0]);
            // }
        }

        function baiBack(){
            console.log('白棋悔棋');
            if(baiBackList.length<1){
                alert('不可悔棋');
                return
            }
            canRevoke = true;
            heiWin = heiBackList[heiBackList.length-1];
            baiWin = baiBackList[baiBackList.length-1];
            try {
                heiTargetList[heiTargetList.length-1].style.background = 'none';
                for(let i=0;i<allArr.length;i++){
                    if(allArr[i]==heiTargetList[heiTargetList.length-1].getAttribute("data-index")){
                        allArr.splice(i,1)
                    }
                }
                baiTargetList[baiTargetList.length-1].style.background = 'none';
                for(let i=0;i<allArr.length;i++){
                    if(allArr[i]==baiTargetList[baiTargetList.length-1].getAttribute("data-index")){
                        allArr.splice(i,1)
                    }
                }
            }catch (e) {
                console.error('错误：' + e.toString())
            }
            let curHeiCountList = heiCountList[heiCountList.length-1];
            for(let i=0;i<curHeiCountList.length;i++){
                heiWin[curHeiCountList[i]] --;
            }
            let curBaiCountList = baiCountList[baiCountList.length-1];
            for(let i=0;i<curBaiCountList.length;i++){
                baiWin[curBaiCountList[i]] --;
            }
            heiReBackList.push(heiBackList.pop());
            baiReBackList.push(baiBackList.pop());
            baiReTargetList.push(baiTargetList.pop());
            heiReTargetList.push(heiTargetList.pop());
            heiReCountList.push(heiCountList.pop());
            baiReCountList.push(baiCountList.pop());
            // let a = allArr.pop();
            // let b = allArr.pop();
            // if(allReArr.length<BACK_COUNT){
            //     allReArr.push([a,b])
            // }else{
            //     allReArr.shift();
            //     allReArr.push([a,b])
            // }
            // console.log(allReArr,'allReArr');

        }

        function heiBack(){
            if(heiBackList.length<1){
                alert('不可悔棋');
                return
            }
            canRevoke = true;
            heiWin = heiBackList[heiBackList.length-1];
            baiWin = baiBackList[baiBackList.length-1];
            baiTargetList[baiTargetList.length-1].style.background = 'none';
            console.log(allArr,'前')
            for(let i=0;i<allArr.length;i++){
                if(allArr[i]==baiTargetList[baiTargetList.length-1].getAttribute("data-index")){
                    allArr.splice(i,1)
                }
            }
            console.log(baiTargetList[baiTargetList.length-1].getAttribute("data-index"),'data-index')
            console.log(allArr,'前')
            heiTargetList[heiTargetList.length-1].style.background = 'none';
            for(let i=0;i<allArr.length;i++){
                if(allArr[i]==heiTargetList[heiTargetList.length-1].getAttribute("data-index")){
                    allArr.splice(i,1)
                }
            }
            let curHeiCountList = heiCountList[heiCountList.length-1];
            for(let i=0;i<curHeiCountList.length;i++){
                heiWin[curHeiCountList[i]] --;
            }
            let curBaiCountList = baiCountList[baiCountList.length-1];
            for(let i=0;i<curBaiCountList.length;i++){
                baiWin[curBaiCountList[i]] --;
            }
            heiReBackList.push(heiBackList.pop());
            baiReBackList.push(baiBackList.pop());
            baiReTargetList.push(baiTargetList.pop());
            heiReTargetList.push(heiTargetList.pop());
            heiReCountList.push(heiCountList.pop());
            baiReCountList.push(baiCountList.pop());
            // let a = allArr.pop();
            // let b = allArr.pop();
            // if(allReArr.length<BACK_COUNT){
            //     allReArr.push([a,b])
            // }else{
            //     allReArr.shift();
            //     allReArr.push([a,b])
            // }
            // console.log(allReArr,'allReArr');
            console.log('黑棋悔棋')
        }


        //点击给棋子赋予不同颜色
        $("#main .pan li").click(function(e) {
            // 如果当前游戏结束，则退出
            if (over) {
                return
            }

            // 获取当前棋子
            let target = e.target || window.event.srcElement;

            // 获取当前棋子坐标
            var dataIndex = target.getAttribute("data-index");

            // 判断当前所点的地方是否已将有棋子
            if (noDown(dataIndex)) {
                // 黑白棋子切换
                if (play) {
                    bai(e);
                    play = !play;
                } else {
                    hei(e)
                    play = !play;
                }
            } else {
                alert("这里已经有棋子了！")
            }
        })

        // 当鼠标指针穿过元素时，会发生 mouseenter 事件
        $("#main .pan li").mouseenter(function(e) {
            // 获取当前鼠标所在对象
            let target = e.target || window.event.srcElement;
            // 获取当前棋子坐标
            let dataIndex = target.getAttribute("data-index");
            // 当前展示棋子的颜色
            let color = "";

            // 黑白棋颜色切换显示
            if (play) {
                color = "#fff"
            } else {
                color = "#000"
            }
            // 判断当前区域是否有棋子
            if (noDown(dataIndex)) {
                $(this).css({
                    background: color,
                })
            }
        }).mouseleave(function(e) { //鼠标移开事件
            let target = e.target || window.event.srcElement;
            let dataIndex = target.getAttribute("data-index");
            if (noDown(dataIndex)) {
                $(this).css({
                    background: "none",
                })
            }
        })

        //判断玩家点的地方是否已经有棋子
        function noDown(data) {
            let yes = true;
            for (let n = 0; n < allArr.length; n++) {
                if (data == allArr[n]) {
                    yes = !yes;
                }
            }
            return yes;
        }

        //游戏结束后点击重新开始按钮重载页面
        function restart() {
            $("#restart").css({
                display: "block"
            }).click(function() {
                window.location.reload();
            })
        }
    }
})