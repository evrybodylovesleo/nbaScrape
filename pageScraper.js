const { link } = require("fs");

let popUpHandled = false;

function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

const scraperObject = {
    url: 'https://www.nba.com/games?date=2023-01-09',
    async scraper(browser){
        let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		// Navigate to the selected page
		await page.goto(this.url);
		// Wait for the required DOM to be rendered
		await page.waitForSelector('[data-id="nba:games:main:game-details:cta"]');
		// Get the link to all the required books

		await page.waitForSelector('#onetrust-accept-btn-handler');
		var acceptCookies = await page.$('#onetrust-accept-btn-handler');
		acceptCookies.click();

		let test = await page.$$('[data-id="nba:games:main:game-details:cta"]');
		await delay(1000);
		for(let i = 0; i< test.length; i++){
			// console.log(await page.evaluate(el => el.textContent, test[i]), i);
			test[i].click();
			var pbp = undefined;

			if(i == 2){
				await page.waitForSelector('#play-by-play');
				try{
					await delay(3000);
					await page.waitForSelector('#bx-step-1949824-1');
					var exitBtn = await page.$(".bx-close-xsvg");
					exitBtn.click();
					await delay(500);
					var pbp = await page.$$(('#play-by-play'));
				}
				catch(e){

				}
			}
			else {
				await page.waitForSelector('#play-by-play');
				var pbp = await page.$$(('#play-by-play'));
			}

			

			// console.log(await page.evaluate(el => el.textContent, pbp[0]));
			await delay(500);
			pbp[0].click()
			await delay(500);
			await page.waitForSelector('span[class*=scoring]');
			var teams = await page.$$('div[class*=GamePlayByPlay_teamLogoWrapper]');
			var team1 = await page.evaluate(el => el.textContent, teams[0]);
			var team2 = await page.evaluate(el => el.textContent, teams[1]);
			
			var score = await page.$$('span[class*=scoring]');
			const parent1 = (await score[0].$x('..'))[0];
			const parent2 = (await parent1.$x('..'))[0];

			var scoreString = await page.evaluate(el => el.textContent, parent2);
			var scoreFinal = scoreString.replace(/[^a-zA-Z\s]/g,'');
			console.log("Score: ", team1, " ", team2, " ",scoreFinal);
			
			await page.goBack();
			test = await page.$$('[data-id="nba:games:main:game-details:cta"]');
			await delay(500);
		}
		
		// await delay(1000);
		// test[0].click();

		// let urls = await page.$$eval('[data-id="nba:games:main:game-details:cta"]', links => {
		// 	let t = links.textContent;
		// 	console.log(t);
		// 	return links;
			
		// 	// // Make sure the book to be scraped is in stock
		// 	// links = links.filter(link => link.querySelector('.instock.availability > i').textContent !== "In stock")
		// 	// // Extract the links from the data
		// 	// links = links.map(el => el.querySelector('h3 > a').href)
		// 	// return links;
		// });
		// console.log(urls);
    }
}

module.exports = scraperObject;

module.exports = scraperObject;