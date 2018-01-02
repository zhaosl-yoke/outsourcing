var sendSMS = true;
$(function() {
    var height = $('.container').height();
    var h = $('body').height();
    var code;
    var realMobile;
    var token;
    var invite = getParametersOnUrl("from");
    console.log(invite);
    $('.back_img').click(function(){
        $("html,body").animate({scrollTop: height+'px'});
    });
    $(window).scroll(function(){
        if($(this).scrollTop()  >= height ){
             $('.bottom').show();
        }else{
            $('.bottom').hide();
        }
    });
    window.onresize = function(){
        if ($('body').height() < h) {
            $('.back').hide();
            $('.introduce').hide();
        }else{
        	isTap = true;
        	$('.back').show();
        	$('.introduce').show();
        }
    };
    //获取验证码
    $('.code').click(function() {
    	var mobile = $('.mobile').val();
    	var regMobile = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
    	if (!mobile) {
    		$('.textMsg').text('请输入手机号');
    		$('.shadow').show();
    		$('body,html').css({"height":"100%","overflow":"hidden"});
    		return;
    	}
    	if (regMobile.test(mobile)) {
			if ($(".code").text() == "获取验证码") {
		    	$.ajax({
					type:"post",
					url:"http://test.datebook.cc/datebook/user/getByMobile",
					async:true,
					contentType: "application/json",
					beforeSend: function(request) {
                        request.setRequestHeader("token", token);
                    },
				    success:function(data) {
				    	console.log(data);
				    	if (data.resultCode == 200) {
				    		$('.textMsg').text('亲，只有新用户才可以领哦～');
							$('.shadow').show();
							$('body,html').css({"height":"100%","overflow":"hidden"});
				    	} else if (data.message == "用户不存在") {
				    		disableButton(60);
				    		sercice("http://test.datebook.cc/datebook/message/sendSMS",function(data) {
				    			console.log(data);
				    			if (data.resultCode == 200) {
				    				$('.prompt').fadeIn(1000);
				    				setTimeout(function() {
				    					$('.prompt').fadeOut(1000);
				    				},3000)
				    				code = data.data.Code;
				    				realMobile = data.data.mobile;
				    			} else {
				    				$('.textMsg').text('发送验证码失败，请重新获取');
									$('.shadow').show();
									$('body,html').css({"height":"100%","overflow":"hidden"});
				    				sendSMS = false;
				    			}
				    		},{
				    			"mobile":mobile,
				    			"type":2
				    		})
				    	} else {
				    		//alert(data.message);
				    		$('.textMsg').text(data.message);
							$('.shadow').show();
							$('body,html').css({"height":"100%","overflow":"hidden"});
				    	}
				    	
				    },
				    data:JSON.stringify({
				    	"mobile":mobile
				    })
				});
			}
		} else {
			$('.textMsg').text("请输入正确的手机号")
			$('.shadow').show();
			$('body,html').css({"height":"100%","overflow":"hidden"});
		}
    })
    //注册事件
    $('.register').click(function(){
    	var mobile = $('.mobile').val();
    	var msgCode = $('.input_code').val();
    	if(mobile==''){
			$('.textMsg').text('请输入手机号码');
			$('.shadow').show();
			$('body,html').css({"height":"100%","overflow":"hidden"});
			return;
	    } 
		if(msgCode == ''){
			$('.textMsg').text('请输入验证码');
			$('.shadow').show();
			$('body,html').css({"height":"100%","overflow":"hidden"});
	        return;
	   }
		if (msgCode == code && mobile == realMobile) {
			$.ajax({
				type:"post",
				url:"http://test.datebook.cc/datebook/account/loginBySMS",
				async:true,
				contentType: "application/json",
				beforeSend:function(XMLHttpRequest){ 
					$('.loading').show();
				}, 
				success: function(data) {
					$('.loading').hide();
					console.log(data);
					if (data.resultCode == 200){
						$('.textMsg').text("您已注册成功，是否下载app？");
						$('.shadow').show();
						$('.confirm').show();
						$('.cancel').show();
						$('.know').hide();
						$('body,html').css({"height":"100%","overflow":"hidden"});
					} else {
						$('.textMsg').text(data.message);
						$('.shadow').show();
						$('body,html').css({"height":"100%","overflow":"hidden"});
					}
				},
				data:JSON.stringify({
					"mobile":mobile,
			    	"userPwd":"",
			    	"device_type":0,
			    	"longitude":0,
			    	"latitude":0,
			    	"uuid":"uuid",
			    	"invite":invite,
			    	"loginType": 1
				})
			});
		} else {
			$('.textMsg').text("手机号或验证码错误，请重新输入");
			$('.shadow').show();
			$('body,html').css({"height":"100%","overflow":"hidden"});
		}	
    })
    getToken();
    function getToken() {
    	sercice("http://test.datebook.cc/datebook/account/login",function(data) {
    		console.log(data);
    		var resultCode = data.resultCode;
	    	if (resultCode == 200) {
	    		token = data.data.token;
	    		console.log(token);
	    	}
    	},{
    		"mobile":11111111111,
	    	"userPwd":"c2a07c15927ca18f5b9f18666f933445",
	    	"device_type":0,
	    	"longitude":0,
	    	"latitude":0,
	    	"uuid":"12",
	    	"loginType":1
    	})
    }
    //弹窗确定
    $('.know').click(function() {
    	$('.shadow').hide();
    	$('html,body').css({
			'overflow':'visible'
		});
    })
    $('.cancel').click(function() {
    	$('.shadow').hide();
    	$('html,body').css({
			'overflow':'visible'
		});
    })
    $('.confirm').click(function() {
    	location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=cc.datebook.app";    	
    })
    //下载
    $('.download').click(function(){
        location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=cc.datebook.app";
    })
})
function disableButton(num) {
	if (sendSMS) {
		if (num > 0) {
			$(".code").text("请" + num + "秒后重试");
			$('.code').css("background","#ccc");
			num--;
			setTimeout("disableButton(" + num + ")", 1000);
		} else {
			$(".code").text("获取验证码");
			$('.code').css("background","#4bd455");
		}
	} else {
		$(".code").text("获取验证码");
		$('.code').css("background","#4bd455");
	}
}