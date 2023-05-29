const game = (function () {
	const gameBoard = (function () {
		let cells = new Array(9);
		return { cells };
	})();

	const Player = (name, mark) => {
		return { name, mark };
	};

	const gameBoardContainer = document.querySelector('.gameboard');
	const Player1 = Player('Gabriel', 'X');
	const Player2 = Player('João', 'O');
	let curentPLayer;

	function creatCellContainer() {
		let divs = [];
		for (let i = 0; i < gameBoard.cells.length; i++) {
			let newDiv = document.createElement('div');
			newDiv.dataset.position = i;
			newDiv.addEventListener('click', addMark);
			divs.push(newDiv);
		}
		appendCell(divs);
		render();
	}

	function setCurrentPlayer() {
		curentPLayer = curentPLayer === Player1 ? Player2 : Player1;
	}

	function addMark(event) {
		let position = event.target.dataset.position;
		if (gameBoard.cells[position] === undefined) {
			gameBoard.cells[position] = curentPLayer.mark;
			render();
			setCurrentPlayer();
			gameOver.checkForGameOver();
		}
	}

	const gameOver = (() => {
		const values = (start, stop, incrementer, nextCell) => {
			return { start, stop, incrementer, nextCell };
		};

		const row = values(0, 6, 3, 1);
		const column = values(0, 3, 1, 3);
		const fisrtDiagonal = values(0, 1, 1, 4);
		const secondDigonal = values(2, 3, 1, 2);

		const checkForGameOver = () => {
			let gameOver =
				verifyGameBoard(row) ||
				verifyGameBoard(column) ||
				verifyGameBoard(fisrtDiagonal) ||
				verifyGameBoard(secondDigonal);
			return gameOver;
		};

		const verifyGameBoard = ({ start, stop, incrementer, nextCell }) => {
			for (let i = start; i <= stop; i += incrementer) {
				if (gameBoard.cells[i] !== undefined) {
					return (
						gameBoard.cells[i] === gameBoard.cells[i + nextCell] &&
						gameBoard.cells[i] === gameBoard.cells[i + nextCell * 2]
					);
				}
      }
      return false
		};

		return { checkForGameOver };
	})();

	function render() {
		let divs = [...gameBoardContainer.children];
		gameBoard.cells.forEach((cell, index) => {
			if (cell != undefined) {
				divs[index].style.color =
					cell === 'X' ? 'var(--color3)' : 'var(--color5)';
				divs[index].innerText = cell;
			}
		});
	}

	function appendCell(cells) {
		cells.forEach((cell) => {
			gameBoardContainer.appendChild(cell);
		});
	}

	creatCellContainer();
	setCurrentPlayer();
})();
