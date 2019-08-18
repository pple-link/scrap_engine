const puppeteer = require('puppeteer');


(async () => {
    const timeout = ms => new Promise(res => setTimeout(res, ms))
    const browser = await puppeteer.launch({headless : false})
    const page = await browser.newPage()
    await page.goto('https://gall.dcinside.com/mgallery/board/write/?id=blooddonation')

    const sid = '피플'
    const spw = 'people123'
    const subject = '질문이 있습니다!'
    const content = '안녕하세요 지정헌혈이 필요한 사람들이 이용할 수 있는 자동헌혈 게시판 플랫폼이 있으면 어떨 것 같나요? 글을 보고 헌혈해주실 사람이 많을까요'
    await page.evaluate((id, pw, sub) => {
        document.querySelector('#name').value = id
        document.querySelector('#password').value = pw
        document.querySelector('#subject').value = sub
        
    }, sid, spw, subject);
    
    await page.evaluate((cont) => {

        const iframe = document.getElementById("tx_canvas_wysiwyg");

        // grab iframe's document object
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        const iframeP = iframeDoc.querySelector('.tx-content-container');

        iframeP.innerHTML = cont 
    }, content);
    await timeout(3000)
    await page.click('[data-no="0"]')
    await timeout(3000)
    await page.click('button[class="btn_blue btn_svc write"]')
    await page.waitForNavigation()



    await browser.close()
})()
