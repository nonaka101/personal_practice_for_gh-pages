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

	const age = dateBase.getFullYear() - dateBirth.getFullYear();
	if(timeBoundaryForAging > dateBase){
		// 加齢タイミングは まだ越えていないため、年齢を1つデクリメント
		return age - 1;
	} else {
		// 加齢タイミングを越えている
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



/**
 * 年月日文字列が適正かを判断
 *
 * @param {string} dateString - 'yyyy-MM-dd' 形式の文字列
 * @returns {boolean} 存在しうる日付かの判定
 */
function isDateFormat(dateString) {
  // 正規表現による形式チェック（yyyy-MM-dd）
  const dateFormatRegexp = /^([0-9]{4})-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])$/;
  if (!dateString.match(dateFormatRegexp)) return false;

  // date 型による妥当性チェック（入力値と実際の日付が、閏日などでずれてないかを含む）
  const dateParts = dateString.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);
  const date = new Date(year, month - 1, day);	// 注：date 型の月は 0 開始となっている
  if (
		date.getFullYear() !== year ||
		date.getMonth() + 1 !== month ||
		date.getDate() !== day
	) {
    return false;
  }

  return true;
}



const dateInput = document.querySelector('#d01js_inputBirthday');	// This value has the required format "yyyy-MM-dd".
// Example : `dateInput.value = '2000-01-23';`



const calcBtn = document.querySelector('#d01js_calcBtn');
calcBtn.addEventListener('click', ()=> {

});
