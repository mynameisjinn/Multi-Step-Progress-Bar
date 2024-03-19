$(document).ready(function () { 
	var currentGfgStep, nextGfgStep, previousGfgStep; 
	var opacity; 
	var current = 1; 
	var steps = $("fieldset").length; 

	// step1  
	var checkboxList = [];
	var requiredCheckbox = $(".required-check");
	var selectCheck = $(".select-check");
	var allCheckbox = $(".all-check");
	var agreeCheckbox = $(".agree-checkbox input[type='checkbox']");

	var checkedCount = 0; // 선택된 체크박스의 개수를 저장할 변수


	// step 2 
	var step2 = $("#step2")

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
	function addUser(username) {
		var usernames = getUsernames();
		usernames.push(username);
		setUsernames(usernames);
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

		console.log("클릭 하고 " + current);
		currentGfgStep = $(this).parent(); 
		nextGfgStep = $(this).parent().next(); 

		// if(current == 1 && checkboxList.length < 2) {
		// 	//alert('필수항목에 모두 동의해주세요');
		// } else 
		// {
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
		
		// } 


		var originalElement = currentGfgStep[0]; // jQuery 객체에서 DOM 요소 추출
		if (originalElement.classList.contains('fieldset2')) {
			// 현재 입력한 사용자명을 가져오기
			var username = document.getElementById("username").value;

			// 기존 사용자명 목록을 가져와서 현재 입력한 사용자명이 이미 있는지 확인
			var existingUsernames = getUsernames();
			if (existingUsernames.includes(username)) {
				alert("이미 사용 중인 사용자명입니다.");
			} else {
				// 새로운 사용자명을 추가하고 쿠키에 저장
				addUser(username);
				alert("사용자명이 저장되었습니다.");
			}
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



// next-step 버튼 클릭 시 사용자명을 쿠키에 저장하고 이미 있는 사용자명인지 검사하는 함수
/*document.querySelector(".next-step").addEventListener("click", function() {
	var username = document.getElementById("username").value;
	var existingUsername = getCookie("username");

	if(current == 2){
		if (existingUsername !== "") {
			if (existingUsername === username) {
				alert("이미 사용 중인 사용자명입니다.");
			} else if(username === ' '){
				alert("사용자명을 입력해주세요")
			} 
			else {
				setCookie("username", username, 30); // 30일 동안 유효한 쿠키로 저장
				alert("사용자명이 저장되었습니다.");
			}
		} else {
			setCookie("username", username, 30); // 30일 동안 유효한 쿠키로 저장
			alert("사용자명이 저장되었습니다.");
		}
	}

});*/
	
}); 
