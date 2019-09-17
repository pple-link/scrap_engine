var express = require('express');
var app = express();
const puppeteer = require('puppeteer');
var request = require('request');

// 관리자 아이디와 토큰
var client_id = '8QRsT_jCVZit1EFLbaUx';
var client_secret = 'J48efEqkfA';
var state = "200";
var redirectURI = encodeURI("http://127.0.0.1:3000");
var api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;



app.get('/',function(req, res){
	
	res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
	const code = req.query.code;
	const state = req.query.state;

	var login_options = {
		url: 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='+ client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state,
		headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
	};
	
	// 로그인
	request.get(login_options, function (error, response, body) {
		if (!error && response.statusCode == 200) {

			// 토큰 요청후의 값
			var body_data = {
				access_token: JSON.parse(body).access_token,
				refresh_token: JSON.parse(body).refresh_token,
				token_type: JSON.parse(body).token_type,
				expires_in: JSON.parse(body).expires_in
			}

			console.log('토큰 요청 후 응답 : ', body_data);

			// 카페 고유값 및 게시판
			const clubid = "10577860";// 카페의 고유 ID값
			const menuid = "2";

			const cafe_list = [
				{clubid: "29872737", menuid: "1"}, // 피플 공식 카페
				{clubid: "10577860", menuid: "2"}, // 고민상담 카페
			];

			// 카페 게시판 주소
			const cafe_api_url = 'https://openapi.naver.com/v1/cafe/' + cafe_list[0].clubid + '/menu/' + cafe_list[0].menuid + '/articles';

			console.log("게시하는 주소 : ", cafe_api_url);

			// 카페에 작성할 내용
			var subject = encodeURI("안녕하세요, 세상을 구하는 붉은 인연, 피플입니다.");
			var content = encodeURI("오늘도 즐거운 하루 되십시요...");

			// 옵션
			var cafe_options = {
				url: cafe_api_url,
				form: {'subject':subject, 'content':content},
				headers: {'Authorization': "Bearer " + body_data.access_token}
			};

			// console.log('글쓰기 요청 헤더 : ', cafe_options);

			// > POST /v1/cafe/{CAFE_ID}/menu/1/articles HTTP/1.1
			// > Host: openapi.naver.com
			// > User-Agent: curl/7.49.1
			// > Accept: */*
			// > Authorization: Bearer AAAAOu4iYfvBjm/owAAIXR2d0XiDHzgOIJv3iAbTHDdBWQPzU+2D1MybX6IbzjUtRenvezRum42qUb5v+mBRwrzBDgs=
			// > Content-Length: 194
			// > Content-Type: application/x-www-form-urlencoded

			request.post(cafe_options, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log("포스팅 요청 완료! ", body);
					res.end(body);
				} else {
					console.log('error');
						if(response != null) {
						res.status(response.statusCode).end();
						console.log(response.body);
					}
				}
			});


		} else {
		res.status(response.statusCode).end();
			console.log('error = ' + response.statusCode);
		}
	});
	
});



console.log(puppeteer.executablePath());
(async () => {
	const timeout = ms => new Promise(res => setTimeout(res, ms));
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setViewport({ width: 1280, height: 1024, deviceScaleFactor: 0.8 });
	await page.goto(api_url);
	const email = 'contact_people';
	const pw = 'bjk2355!';

	await page.evaluate(
		(em, pw) => {
			document.querySelector('#id').value = em;
			document.querySelector('#pw').value = pw;
		},
		email,
		pw
	);

	await timeout(2000);
	await Promise.all([page.click('.btn_global'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);
	await timeout(3000);
	await page.waitForNavigation();
	await browser.close();
})();

app.listen(3000, function () {
	console.log('http://127.0.0.1:3000/naverlogin app listening on port 3000!');
});