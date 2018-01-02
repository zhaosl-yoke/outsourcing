$(function() {
	//生成tab按钮事件
	var $tab = $('.tab');
	var $li = '';
	$.ajax({
		type:"get",
		url:"data.json",
		async:true,
		success: function(res) {
			var data = res.data;
			if (data.length) {
				for (var i = 0; i < data.length; i ++) {
					$li += '<li data-id="'+ data[i].id+'">'+ data[i].name+'</li>'
				}
				$tab.append($li);
				$('.tab').find('li').eq(0).addClass('active');
				$('.tab li').click(function() {
					var id = $(this).data('id');
					toQuestion(id);
					$(this).addClass('active');
					$(this).siblings().removeClass('active');
				})
			}
		}
	});
	toQuestion(0);
	function toQuestion(id){
		var $question = $('.question');
		$question.empty();
		var $list = '';
		$.ajax({
			type:"get",
			url:"tabdata.json",
			async:true,
			success: function(res) {
				var data = res.data[id];
				var array1 = data.array1;
				for (var i = 0; i < array1.length; i++) {
					$list += '<li>'+
								'<div class="title flag" style="font-size: 16px;">'+
									'<span class="open flag">' + array1[i].question + '</span>' +
									'<img id="arrow_' + i +'" src="img/more.png" alt="" class="up_down"/>'+
								'</div>'+
								'<div class="answer" style="font-size: 14px;display: none;color:#999;padding:0px 5px 20px 0px;">'+
									'<p>'+ array1[i].answer+'</p>'+
								'</div>'+
							'</li>'
				}
				$question.append($list);
				//展开事件
				$('.title').click(function(i) {
					if ($(this).hasClass('flag')) {
						$(this).removeClass('flag');
						$(this).parent().find('.answer').show();
						$(this).find('img').attr('src','img/hide.png');
					} else {
						$(this).addClass('flag');
						$(this).parent().find('.answer').hide();
						$(this).find('img').attr('src','img/more.png');
					}
				})
				/*$('.up_down').click(function() {
					if ($(this).hasClass('flag')) {
						$(this).removeClass('flag');
						$(this).parent().parent().find('.answer').show();
						$(this).attr('src','img/hide.png');
					} else {
						$(this).addClass('flag');
						$(this).parent().parent().find('.answer').hide();
						$(this).attr('src','img/more.png');
					}
				})*/
			}
		});
	}
})
