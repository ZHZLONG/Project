;(function () {
    "use strict";
    var $form_add_task = $(".add-task"),
        $task_list = $('.task-list'),
        $clear = $("#clear"),
        $task_add_input = $("input[name=content]"),
        taskList = [],
        taskContent = "",
        screenWidth = $(document).outerWidth(),
        $alert = $(".alert")
        ;
    init();
    window.onresize = function () {
        screenWidth = $(document).outerWidth();
        if(screenWidth<=400){
            renderTaskList(taskList)
        }else {
            renderTaskList(taskList)
        }
    }
    //添加新task提交事件
    $form_add_task.off().on("submit",function (e) {
        e.preventDefault();
        e.stopPropagation();
        var newTask = {};
        newTask.content = $task_add_input.val();
        newTask.completed = false;
        //判断输入是否为空
        if (!newTask.content) return;
        //存入新的task
        if (addTask(newTask)){
            //更新首页列表
            renderTaskItem(newTask,true);
            $task_add_input.val(null);
            bindEvent()
        }
    })
    //清空taskList事件
    $clear.off().on("click",function (e) {
        e.preventDefault();
        e.stopPropagation();
        store.clear();
        init()
    })
    //taskDetail提交事件
    $("#detailSubmit").off().on("click",function (e) {
        e.preventDefault();
        e.stopPropagation();
        var editedTask = {};
        editedTask.content = $("p.task-content").html();
        editedTask.Description = $("textarea.task-desc").val();
        editedTask.remindDate = $("input#datetimepicker").val();
        editTask(editedTask);
        renderTaskList(taskList);
        hideTaskDetail();
    })
    //选中已完成task事件
    $(".select-complete").off().on("click",function (e) {
        e.preventDefault();
        e.stopPropagation();
        selectCompleteTask()
    })
    //选中未完成task事件
    $(".select-unfinished").off().on("click",function (e) {
        e.preventDefault();
        e.stopPropagation();
        selectUnfinishedTask()
    })
    //选中全部事件
    $(".select-all").off().on("click",function (e) {
        e.preventDefault();
        e.stopPropagation();
        renderTaskList(taskList);
    })
    //选中未完成task函数
    function selectUnfinishedTask() {
        var unFinishedTaskList = taskList.filter(function (ele) {
            return (ele.completed==false)
        })
        renderTaskList(unFinishedTaskList)
    }
    //选中已完成task函数
    function selectCompleteTask() {
        var completeTaskList = taskList.filter(function (ele) {
            return (ele.completed==true)
        })
        renderTaskList(completeTaskList)
    }
    //删除单个task函数
    function removeTask(content) {
        taskList = store.get("taskList");
        taskList = taskList.filter(function (ele) {
            return (ele.content != content)
        });
        store.set("taskList",taskList);
    }
    //获取task详情的函数
    function getTaskDetail(content) {
        taskList = store.get("taskList");
        return taskList.filter(function (ele) {
            return (ele.content == content)
        });
    }
    //显示task详情
    function showTaskDetail(obj,color) {
        taskContent = obj.content;
        $('.task-detail-content').css('borderColor',color)
        $('p.task-content').html(obj.content).css("backgroundColor",color);
        $("#detailSubmit").css("backgroundColor",color)
        $("textarea.task-desc").val(obj.Description||null).css("backgroundColor",color);
        $("input#datetimepicker").val(obj.remindDate||null).css("backgroundColor",color);
        $('.task-detail').fadeIn("slow",function () {
            $('.task-detail-content').slideDown("slow")
        });
    }
    //隐藏task详情
    function hideTaskDetail() {
        $('.task-detail-content').slideUp("slow",function () {
            $('.task-detail').fadeOut("slow")
        })
    }
    //绑定事件
    function bindEvent() {
        //删除事件
        $('.task-delete').off().on('click',function (e) {
            e.preventDefault();
            e.stopPropagation();
            var tmp = confirm("确定删除？");
            //删除storage里的数据
            if(tmp){
                var deleteTaskContent = $(this).siblings(".task-content").find("span").html();
                $(this).parents("li").slideUp("fast");
                removeTask(deleteTaskContent);
            }
        })
        //查看详情事件
        $('.view-task-detail').off().on('click touchstart',function (e) {
            e.preventDefault();
            e.stopPropagation();
            var taskContent = $(this).siblings(".task-content").find("span").html();
            var taskColor = $(this).css('backgroundColor');
            var taskDetail = getTaskDetail(taskContent)[0];
            showTaskDetail(taskDetail,taskColor)
        })
        //关闭详情事件
        $('.task-detail').off().on('click',function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.target.tagName=="SECTION"){
                hideTaskDetail()
            }
        })
        //选中完成事件
        $("span.task-content").off().on("dblclick touchstart",function (e) {
            e.preventDefault();
            e.stopPropagation();
            var complete = !$(this).siblings(".task-complete").prop("checked");
            $(this).siblings(".task-complete").prop("checked", complete)
            var completeContent = $(this).find("span").html();
            setTaskComplete(completeContent, complete);
            if (complete) {
                $(this).find('.task-complete-mask').show('slow', function () {
                    $(this).find('span').fadeIn('slow')
                });
            } else {
                $(this).find('.task-complete-mask').find('span').fadeOut('slow', function () {
                    $(this).parents('.task-complete-mask').hide('slow')
                })
            }
        })
    }
    //设置task完成函数
    function setTaskComplete(content,complete) {
        taskList.map(function (ele) {
            if(ele.content==content){
                return ele.completed = complete
            }else {
                return ele
            }
        })
        store.set("taskList",taskList);
    }
    //渲染taskList函数
    function renderTaskList(List) {
        $task_list.html(" ");
        List.forEach(function (ele) {
           renderTaskItem(ele)
        });
        bindEvent();
    }
    //渲染taskItem函数
    function renderTaskItem(ele,animate) {
        var taskItemTemplate = '<li class="task-item clearfix">'+
                                    '<input type="checkbox" class="task-complete" '+
                                    (ele.completed?"checked='checked'":"") +'>'+
                                    '<span class="task-content"><span>'+ ele.content +
                                    '</span><div class="task-complete-mask" style="display: '+ (ele.completed?"inline":"none") +'">'+
                                    '<span style="display: '+ (ele.completed?"inline":"none") +'">'+ ele.content +' 已完成</span></div>' +
                                    '</span>'+
                                    '<button class="task-delete pull-right">'+ ((screenWidth<=400)?"X":"删除")+'</button>'+
                                    '<button class="view-task-detail pull-right">' + ((screenWidth<=400)?"i":"详细") + '</button>'+
                                '</li>';
        if(animate){
            $(taskItemTemplate).appendTo($task_list).hide().slideDown('fast')
        }else {
            $(taskItemTemplate).appendTo($task_list)
        }
    }
    //添加newTask函数
    function addTask(newTask) {
        taskList.push(newTask);
        store.set("taskList",taskList);
        //添加成功，返回true
        return true
    }
    //编辑task函数
    function editTask(editedTask) {
        taskList = taskList.map(function (ele) {
            if(ele.content==taskContent){
                for (var attr in editedTask){
                    ele[attr] = editedTask[attr]
                }
                return ele
            }else {
                return ele
            }
        })
        store.set("taskList",taskList);
        return true
    }
    //taskDate提醒函数
    function checkTaskDate() {
        taskList.forEach(function (ele) {
            if (ele.remindDate){
                var taskTime = new Date(ele.remindDate).getTime();
                var currentTime = Date.now();
                if ((currentTime-taskTime)>=1&&(currentTime-taskTime<=1000)){
                    taskNotice(ele)
                }
            }
        })
    }
    //关闭时间提醒事件

    //事件提醒函数
    function taskNotice(task) {
        var noticeTpl = task.content + "<span>"+task.Description+"</span><i>×</i>"
        $(".task-notice").html(noticeTpl).fadeIn('slow');
        $alert.get(0).play()
        $(".task-notice").find("i").on("click",function () {
            $(".task-notice").fadeOut("slow");
        })
    }
    //初始化函数
    function init() {
        taskList = store.get("taskList")||[];
        renderTaskList(taskList);
        setInterval(function () {
            checkTaskDate()
        },1000)
        jQuery.datetimepicker.setLocale('ch');
        $('#datetimepicker').datetimepicker(
            {theme:'dark'}
        );
    }
})();
