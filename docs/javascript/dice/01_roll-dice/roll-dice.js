const dieFace = ['🎲', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

class Dice {
	constructor (id) {
		this.val = 0;
		this.name = id;
		this.element = document.getElementById(id);
		this.chkbox = this.element.firstElementChild;
		this.txtval = this.element.lastElementChild;
		this.txtval.textContent = dieFace[this.val];
	}

	getVal() {
		return this.val;
	}

	setVal(n) {
		/*
		if (n > 0 && n <= 6) {
			this.val = n;
			this.update();
		} else {
			console.log('Error: ' + this.id + 'tried to set ' + n + '.');
		*/
		this.val = n;
		this.update();
	}

	roll() {
		if (! this.chkbox.checked) {
			this.setVal(Math.floor(Math.random() * 6) + 1);
		}
	}

	update() {
		this.txtval.textContent = dieFace[this.getVal()];
	}
}

let d1 = new Dice(`dice1`);
let d2 = new Dice(`dice2`);
let d3 = new Dice(`dice3`);
let d4 = new Dice(`dice4`);
let d5 = new Dice(`dice5`);

let dices =[d1, d2, d3, d4, d5];

const btnRoll = document.getElementById('btn-roll');
btnRoll.addEventListener('click', () => {
	dices.forEach(d => {
		d.roll();
	});
})
/*
const d1chk = document.getElementById('dice1_chk');
const d1val = document.getElementById('dice1_val');
d1val.textContent = dieFace[0];

const btnRoll = document.getElementById('btn-roll');
btnRoll.addEventListener('click', () => {
	d1val.textContent = dieFace[rollDice()];
})
*/
