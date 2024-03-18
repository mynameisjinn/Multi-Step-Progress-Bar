$(document).ready(function () { 
	var currentGfgStep, nextGfgStep, previousGfgStep; 
	var opacity; 
	var current = 1; 
	var steps = $("fieldset").length; 

	// checkBox 
	var checkboxList = [];
	var requiredCheck = $(".required-check");
	var selectCheck = $(".select-check");
	var allCheckBox = $(".all-check");
	var agreeCheckbox = $(".agree-checkbox input[type='checkbox']");

	var checkedCount = 0; // 선택된 체크박스의 개수를 저장할 변수



	function IsAllCheck() {
		if(checkedCount == 3){
			allCheckBox.prop("checked",true);
		} else {
			allCheckBox.prop("checked",false);
		}
	}


	function allCheck() {
	
		if(allCheckBox.is(":checked")){
			agreeCheckbox.prop("checked",true);
			checkedCount = 3;
		}else if( allCheckBox.is(":not(:checked)") ) {
			// 체크되지 않은 상태일 때 실행할 코드
			agreeCheckbox.prop("checked",false);
			checkedCount = 0;
		}

	}


	allCheckBox.on("click", function(){
		allCheck();
	});

	$(".checked-list input[type='checkbox']").on("change", function() {
		if ($(this).is(":checked")) {
			checkedCount++; 
		} else {
			checkedCount--; 
		}		
		IsAllCheck();
	});
	
	requiredCheck.on("click", function() {
		checkboxList = []; // 기존에 저장된 값들을 초기화
		requiredCheck.each(function() {
			if ($(this).is(":checked")) {
				checkboxList.push($(this).val());
			}
		});		
	});


	setProgressBar(current); 

	$(".next-step").click(function () { 

		currentGfgStep = $(this).parent(); 
		nextGfgStep = $(this).parent().next(); 

		if(current == 1 && checkboxList.length < 2) {
			alert('필수항목에 모두 동의해주세요');
		} else {
			$("#progressbar li").eq($("fieldset") 
			.index(nextGfgStep)).addClass("active"); 

		nextGfgStep.show(); 
		currentGfgStep.animate({ opacity: 0 }, { 
			step: function (now) { 
				opacity = 1 - now; 

				currentGfgStep.css({ 
					'display': 'none', 
					'position': 'relative'
				}); 
				nextGfgStep.css({ 'opacity': opacity }); 
			}, 
			duration: 500 
		}); 
			setProgressBar(++current); 
		}

	}); 

	$(".previous-step").click(function () { 

		currentGfgStep = $(this).parent(); 
		previousGfgStep = $(this).parent().prev(); 

		$("#progressbar li").eq($("fieldset") 
			.index(currentGfgStep)).removeClass("active"); 

		previousGfgStep.show(); 

		currentGfgStep.animate({ opacity: 0 }, { 
			step: function (now) { 
				opacity = 1 - now; 

				currentGfgStep.css({ 
					'display': 'none', 
					'position': 'relative'
				}); 
				previousGfgStep.css({ 'opacity': opacity }); 
			}, 
			duration: 500 
		}); 
		setProgressBar(--current); 
	}); 

	function setProgressBar(currentStep) { 
		var percent = parseFloat(100 / steps) * current; 
		percent = percent.toFixed(); 
		$(".progress-bar") 
			.css("width", percent + "%") 
	} 

	$(".submit").click(function () { 
		return false; 
	}) 
}); 
