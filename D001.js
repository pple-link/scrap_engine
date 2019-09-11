//test
//http://cafe.daum.net/_c21_/united_write?grpid=1YEzH&fldid=pN85

const puppeteer = require('puppeteer');

(async () => {
	const timeout = ms => new Promise(res => setTimeout(res, ms));
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.setViewport({ width: 1280, height: 1024, deviceScaleFactor: 0.8 });
	await page.goto(
		'https://accounts.kakao.com/login?continue=http%3A%2F%2Fcafe.daum.net%2F_c21_%2Funited_write%3Fgrpid%3D1YEzH%26fldid%3DpN85'
	);
	const email = 'haam_0@naver.com';
	const pw = '5774357q';

	await page.evaluate(
		(em, pw) => {
			document.querySelector('#id_email_2').value = em;
			document.querySelector('#id_password_3').value = pw;
		},
		email,
		pw
	);
	await Promise.all([page.click('.btn_type2'), page.waitForNavigation({ waitUntil: 'networkidle0' })]);

	const subject = '질문이 있습니다!';
	const content =
		'안녕하세요 지정헌혈이 필요한 사람들이 이용할 수 있는 자동헌혈 게시판 플랫폼이 있으면 어떨 것 같나요? 글을 보고 헌혈해주실 사람이 많을까요';

	await page.evaluate(
		async (sub, cont) => {
			const iframeBig = document.getElementById('down');
			const iframeDocBig = iframeBig.contentDocument || iframeBig.contentWindow.document;
			const iframePBig = iframeDocBig.querySelector('.wideType');
			iframePBig.value = sub;

			const iframe = iframeDocBig.querySelector('#tx_canvas_wysiwyg');

			// grab iframe's document object
			const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

			const iframeP = iframeDoc.querySelector('.tx-content-container');

			iframeP.innerHTML = cont;
			const bt = iframeDocBig.querySelector(
				'#primaryContent > table > tbody > tr.pos_rel > td.cb > div > div.list_btn_area.lineT.pos_rel > span.center_btn_area3 > a:nth-child(2)'
			);
			bt.click();
			console.log(123);
		},
		subject,
		content
	);

	const sa = await page.$('#down');

	await timeout(3000);
	await page.waitForNavigation();

	await browser.close();
})();
