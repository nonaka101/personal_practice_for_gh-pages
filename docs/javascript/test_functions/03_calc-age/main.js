// 2月29日24時について、2024年（閏年）の場合は 3/1 となる
const d2 = new Date(2024, 1, 29, 24, 0) // -> 2024-03-01 00:00

// 2023年（閏年でない）の場合は 2月29日は3月1日となり、その24時なので 3/2 となる
const d1 = new Date(2023, 1, 29, 24, 0) // -> 2023-03-02 00:00


/**
 * 生年月日から、年齢を計算する
 *
 * @param {date} dateBirth - 生年月日
 * @param {date} dateBase - 計算基準日（今日）
 */
function calcAge(dateBirth, dateBase = new Date()){

	/* 加齢境界線は、生まれた月日の前日24時となる
	 *（閏日生まれの場合は2/28日24時、3/1生まれの場合は閏年の場合は2/29そうでなければ2/28）*/
	const timeBoundary = new Date(
		dateBase.getFullYear(),
		dateBirth.getMonth(),
		dateBirth.getDate() - 1,
		24
	);
	console.log(`今年 加齢されるタイミングは、${timeBoundary} です。`);

	if(timeBoundary > dateBase){
		console.log('加齢タイミングはまだ越えていません');
	} else {
		console.log('加齢タイミングを越えています');
	}
}
