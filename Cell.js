export default class Cell {
	constructor(c, x, y, size, type) {
		this.type = 'empty'
		this.c = c;
		this.x = x;
		this.y = y;
		this.size = size;
	}
	changeType(type){
		this.type = type;
	}
	// update everything
	update(position) {
		if (position !== null) {
			if (this.x * this.size <= position.x && this.x * this.size + this.size >= position.x &&
                this.y * this.size <= position.y && this.y * this.size + this.size >= position.y) {
				this.needsSave = true;
			}
		}
		this.draw();
	}

	draw() {
		switch (this.type) {
			case 'empty':
				this.c.fillStyle = '#fff';
				this.c.strokeRect(this.x * this.size, this.y * this.size, this.size, this.size);
				break;
			case 'obstacle':
				this.c.fillStyle = '#ccc';
				this.c.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
				break;
			case 'robot':
				this.c.fillStyle = '#ff4444';
				this.c.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
				break;
			case 'goal':
				this.c.fillStyle = '#00ff00';
				this.c.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);
				break;
			default:
				break;
		}
	}
}

