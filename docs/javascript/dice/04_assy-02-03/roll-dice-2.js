const dieFace = ['🎲', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅',];

function toDieFace(num) {
	if([1, 2, 3, 4, 5, 6].includes(num)){
		return dieFace[num];
	} else {
		return dieFace[0];
	}
}

/**
 *
 */
class htmlCtrl {
	constructor(num, id){

		this.label = document.createElement('label');
		this.label.classList.add('bl_dice');

		this.input = document.createElement('input');
		this.input.type = 'checkbox';
		this.input.checked = false;
		this.input.name = 'dice' + num;
		this.input.classList.add('bl_dice_chkbox');

		this.span = document.createElement('span');
		this.span.classList.add('bl_dice_val');
		this.span.dataset.num = 1
		this.span.textContent = toDieFace(1);

		this.label.appendChild(this.input);
		this.label.appendChild(this.span);

		this.parent = document.getElementById(id);
		this.parent.appendChild(this.label);
	}
	get value(){
		let num = parseInt(this.span.dataset.num);
		let locked = this.input.checked;
		return [num, locked];
	}
	set value(states){
		const [num, locked] = states;
		this.span.dataset.num = num;
		this.span.textContent = toDieFace(num);
		this.input.checked = locked;
	}
}

class Dices {
	constructor(num){
		this.count = num;
		this.htmlCtrls = [];
		for(let i=1; i<= this.count; i++){
			this.htmlCtrls.push(new htmlCtrl(i, 'js_dice'));
		}
	}

	get values(){
		let states = [];
		for(let dice of this.htmlCtrls){
			states.push(dice.value);
		}
		return states;
	}

	set values(states){
		for(let i=0; i<= this.count -1; i++){
			this.htmlCtrls[i].value = states[i];
		}
	}

	roll(){
		const states = this.values;
		let newStates = [];
		for (let state of states){
			let [num, locked] = state;
			if(locked === false) {
				num = Math.floor(Math.random() * 6) + 1;
			}
			newStates.push([num, locked]);
		}
		
		// Sort
		newStates = newStates.sort(function(a,b){
			return(a[0] - b[0]);
		});

		this.values = newStates;
	}
}

let game = new Dices(5);

const btn = document.getElementById('btn-roll');
btn.addEventListener('click',() => {
	game.roll();
})
