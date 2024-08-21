// 2月29日24時について、2024年（閏年）の場合は 3/1 となる
const d2 = new Date(2024, 1, 29, 24, 0) // -> 2024-03-01 00:00

// 2023年（閏年でない）の場合は 2月29日は3月1日となり、その24時なので 3/2 となる
const d1 = new Date(2023, 1, 29, 24, 0) // -> 2023-03-02 00:00



/**
 * 生年月日から、年齢を計算する（時間基準）
 *
 * @param {date} dateBirth - 生年月日
 * @param {date} dateBase - 計算基準日（今日）
 * @returns {int} - 満年齢
 */
function calcAge(dateBirth, dateBase = new Date()){

	/* 加齢境界線は、生まれた月日の前日24時となる
	 *（閏日生まれの場合は2/28日24時、3/1生まれの場合は閏年の場合は2/29そうでなければ2/28）*/
	const timeBoundaryForAging = new Date(
		dateBase.getFullYear(),
		dateBirth.getMonth(),
		dateBirth.getDate() - 1,
		24
	);
	console.log(`今年 加齢されるタイミングは、${timeBoundaryForAging} です。`);

	const age = dateBase.getFullYear() - dateBirth.getFullYear();
	if(timeBoundaryForAging > dateBase){
		console.log('加齢タイミングはまだ越えていません');
		return age - 1;
	} else {
		console.log('加齢タイミングを越えています');
		return age;
	}
}



/**
 * ２つの日付間にある日数（絶対値）を算出
 *
 * @param {date} date1 - 日付１
 * @param {date} date2 - 日付２
 * @returns {int} 期間内の日数（余剰の時間は切り捨て）
 */
function dateDiff(date1, date2) {
	const ms = Math.abs(Date.parse(date1) - Date.parse(date2));	// ミリ秒単位での期間
	return Math.floor(ms / (1000 * 60 * 60 * 24));	// ミリ秒を日数単位にして返す
}



/**
 * 生年月日から、年齢（時間基準）と経過日数を計算して表示
 *
 * @param {date} dateBirth - 生年月日
 * @param {date} dateBase - 計算基準日（今日）
 */
function calcAgeDays(dateBirth, dateBase = new Date()){
	if(!(dateBirth instanceof Date && dateBase instanceof Date)) throw new Error('引数は date 型でなければなりません');

	// 年齢算出
	const age = calcAge(dateBirth, dateBase);

	// 現年齢の加齢タイミング（≒誕生日前日24時）
	const timeAgingInThisYear = new Date(
		dateBirth.getFullYear() + age,
		dateBirth.getMonth(),
		dateBirth.getDate() - 1,
		24
	);

	// 経過日数を算出
	const days = dateDiff(timeAgingInThisYear, dateBase);

	console.log(`年齢は ${age} 歳、経過日数は ${days} 日です。`);
}
