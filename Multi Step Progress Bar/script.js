$(document).ready(function () { 
	var currentGfgStep, nextGfgStep, previousGfgStep; 
	var opacity; 
	var current = 1; 
	var steps = $("fieldset").length; 

	var checkboxList = [];
	var requiredCheckbox = $(".required-check");
	// var selectCheck = $(".select-check");
	var allCheckbox = $(".all-check");
	var agreeCheckbox = $(".agree-checkbox input[type='checkbox']");
	var checkedCount = 0; // 선택된 체크박스의 개수를 저장할 변수

	var originalElement;
	var existingUsernames
	var username = $(".username");
	var usernameValue;
	var usernameError;

	var password = $(".password");
	var passwordValue;
	var passwordConfirm = $(".confirm_password");
	var passwordConfirmValue;


	function IsAllCheck() {
		if(checkedCount == 3){
			allCheckbox.prop("checked",true);
		} else {
			allCheckbox.prop("checked",false);
		}
	}


	function allCheck() {
	
		if(allCheckbox.is(":checked")){
			agreeCheckbox.prop("checked",true);
			checkedCount = 3;
		}else if( allCheckbox.is(":not(:checked)") ) {
			// 체크되지 않은 상태일 때 실행할 코드
			agreeCheckbox.prop("checked",false);
			checkedCount = 0;
		}

		requiredCheck();

	}

	function requiredCheck() {
		checkboxList = []; // 기존에 저장된 값들을 초기화
		requiredCheckbox.each(function() {
			if ($(this).is(":checked")) {
				checkboxList.push($(this).val());
			}
		});		
	}

	
	function setProgressBar(currentStep) { 
		var percent = parseFloat(100 / steps) * current; 
		percent = percent.toFixed(); 
		$(".progress-bar") 
			.css("width", percent + "%") 
	} 

	 // 사용자명을 쿠키에 저장하는 함수
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	
	// 쿠키에서 사용자명을 가져오는 함수
	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	// 쿠키에서 사용자명 목록을 가져오는 함수
	function getUsernames() {
		var usernames = getCookie("usernames");
		if (usernames === "") {
			return [];
		}
		return JSON.parse(usernames);
	}

	// 사용자명을 쿠키에 저장하는 함수
	function setUsernames(usernames) {
		setCookie("usernames", JSON.stringify(usernames), 30); // 30일 동안 유효한 쿠키로 저장
	}

	// 새로운 사용자명을 추가하는 함수
	function addUser(usernameValue) {
		var usernames = getUsernames();
		usernames.push(usernameValue);
		setUsernames(usernames);
	}

	function nextStep(){
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

	allCheckbox.on("click", function(){
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
	
	requiredCheckbox.on("click", function() {
		requiredCheck();
	});


	setProgressBar(current); 

	$(".next-step").click(function () { 

		currentGfgStep = $(this).parent(); 
		nextGfgStep = $(this).parent().next(); 

		// step 1
		if(current == 1 && checkboxList.length < 2) {
		 	alert('필수항목에 모두 동의해주세요');
		} else if(current == 1 && checkboxList.length >=2)
		{
			nextStep();
		} 

		

		// step 2 
		originalElement = currentGfgStep[0]; // jQuery 객체에서 DOM 요소 추출
		var noError = false;

		if (originalElement.classList.contains('fieldset2')) {
			var usernameValue = username.val();
			var passwordValue = password.val();
			var passwordConfirmValue = passwordConfirm.val();
		
			if (usernameValue === '') {
				alert("사용자명을 입력해주세요.");
			} else {
				existingUsernames = getUsernames();
				if (existingUsernames.includes(usernameValue)) {
					alert("이미 사용 중인 사용자명입니다.");
				} else {
					//addUser(usernameValue);
					noError = true;
				}
			}
			
			if (noError && passwordValue === '') {
				alert('비밀번호를 입력해주세요');
			} else if (noError && passwordValue.length < 6) {
				alert('비밀번호는 6자 이상이어야 합니다');
			} else if (noError && passwordConfirmValue === '') {
				alert('비밀번호를 확인해주세요');
			} else if (noError && passwordValue !== passwordConfirmValue) {
				alert('비밀번호가 일치하지 않습니다');
			} else if(noError){
				nextStep();
			}
		}
		

		// step3


	}); 

	

	username.blur(function() {
		
		usernameValue = $(this).val();
		usernameError = $('.username-error');
		existingUsernames = getUsernames();

		if(usernameValue == ''){
			usernameError.text('공백은 입력할 수 없습니다');
		}else if (existingUsernames.includes(usernameValue)){
			usernameError.text('이미 사용 중인 사용자명입니다');
		}else {
			usernameError.text('사용 가능');
		}

	});

	password.blur(function() {
		passwordValue = $(this).val();
		
		if(passwordValue == ''){
			$('.ps-error').text('비밀번호를 입력해주세요');
		}else if (passwordValue.length < 6) {
			$('.ps-error').text('비밀번호는 6자 이상이어야 합니다');
		} else  {
			$('.ps-error').text('');
		}
	});

	passwordConfirm.blur(function() {
		passwordConfirmValue = $(this).val(); 
	
		if(passwordConfirmValue == ''){
			$('.conf-ps-error').text('비밀번호를 확인해주세요');
		}else if (passwordValue !== passwordConfirmValue) {
			$('.conf-ps-error').text('비밀번호가 일치하지 않습니다');
		} else {
			$('.conf-ps-error').text('');
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


	$(".submit").click(function () { 
		return false; 
	}) 
	
}); 
