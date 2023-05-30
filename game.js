const game = (function () {
	const gameControler = (() => {
		const gameBoard = (function () {
			let cells = new Array(9);
			return { cells };
		})();

		const Player = (name, mark) => {
			return { name, mark };
		};

		let curentMode;
		const Player1 = Player('Player1', 'X');
		const Player2 = Player('Player2', 'O');
		let curentPLayer;

		const setMode = (mode) => {
			curentMode = mode;
			console.log(`[curent Mode]: ${curentMode}`);
		};

		setMode('player');

		const getCurentMode = () => {
			return curentMode;
		};

		const setCurrentPlayer = () => {
			curentPLayer = curentPLayer === Player1 ? Player2 : Player1;
		};

		setCurrentPlayer();

		const playRound = (position) => {
			if (isEmpty(position)) {
				gameBoard.cells[position] = curentPLayer.mark;
				if (gameStatus.checkForGameOver()) {
					endGame(gameStatus.checkForGameOver());
				}
				setCurrentPlayer();
			}
		};

		const isEmpty = (position) => {
			return gameBoard.cells[position] === undefined;
		};

		const getGameBoard = () => {
			return gameBoard.cells;
		};

		const getCurentPLayer = () => {
			return curentPLayer;
		}

		const endGame = (status) => {
			if (status === 'tie') {
				console.log("it's a tie");
			}
			if (status === 'winner') {
				console.log(`${curentPLayer.name} win!`);
			}
		};

		const gameStatus = (() => {
			const values = (start, stop, incrementer, nextCell) => {
				return { start, stop, incrementer, nextCell };
			};

			const row = values(0, 6, 3, 1);
			const column = values(0, 3, 1, 3);
			const fisrtDiagonal = values(0, 1, 1, 4);
			const secondDigonal = values(2, 3, 1, 2);

			const checkForGameOver = () => {
				if (checkForWinner()) {
					return 'winner';
				}
				if (checkForTie()) {
					return 'tie';
				}
				return false;
			};

			const checkForWinner = () => {
				return (
					verifyGameBoard(row) ||
					verifyGameBoard(column) ||
					verifyGameBoard(fisrtDiagonal) ||
					verifyGameBoard(secondDigonal)
				);
			};

			const checkForTie = () => {
				for (let i = 0; i < gameBoard.cells.length; i++) {
					if (gameBoard.cells[i] === undefined) {
						return false;
					}
				}
				return true;
			};

			const verifyGameBoard = ({ start, stop, incrementer, nextCell }) => {
				for (let i = start; i <= stop; i += incrementer) {
					if (gameBoard.cells[i] !== undefined) {
						if (
							gameBoard.cells[i] === gameBoard.cells[i + nextCell] &&
							gameBoard.cells[i] === gameBoard.cells[i + nextCell * 2]
						) {
							return true;
						}
					}
				}
				return false;
			};

			return { checkForGameOver };
		})();

		return { getGameBoard, playRound, setMode, getCurentMode, getCurentPLayer };
	})();

	const ScreenControler = (() => {
		const GameBoard = (() => {
			const turnDisplay = document.querySelector('.turnDisplay');
			const gameBoardContainer = document.querySelector('.gameBoard');
		

			function creatCellContainer() {
				let cells = [];
				for (let i = 0; i < gameControler.getGameBoard().length; i++) {
					let newCell = document.createElement('div');
					newCell.dataset.position = i;
					newCell.addEventListener('click', playRound);
					cells.push(newCell);
				}
				appendELements(cells);
			}

			function appendELements(cells) {
				cells.forEach((cell) => {
					gameBoardContainer.appendChild(cell);
				});
			}

			const activeTurnDisplay = () => {
				turnDisplay.style.display = 'flex'
			}

			const changeTurnDisplay = () => {
				const playerMark = document.querySelector('.mark');
				playerMark.innerText = `${gameControler.getCurentPLayer().mark}`;
			};

			function init() {
				creatCellContainer();
				activeTurnDisplay();
				changeTurnDisplay();
			}

			return {
				init,
				changeTurnDisplay,
				gameBoardContainer,
			};
		})();

		const initialScreen = (() => {
			const playerBtn = document.querySelector('#playerBtn');
			const IaBtn = document.querySelector('#iaBtn');
			const startBtn = document.querySelector('#startBtn');
			const MenuWrapper = document.querySelector('.wrapper');
			const header = document.querySelector('.header')

			function toggleBtn() {
				if (gameControler.getCurentMode() === 'player') {
					playerBtn.classList.add('active');
					IaBtn.classList.remove('active');
				} else {
					playerBtn.classList.remove('active');
					IaBtn.classList.add('active');
				}
			}
			playerBtn.addEventListener('click', () => {
				gameControler.setMode('player');
				toggleBtn();
			});
			IaBtn.addEventListener('click', () => {
				gameControler.setMode('ia');
				toggleBtn();
			});
			toggleBtn();

			function closeMenuHeader() {
				MenuWrapper.style.display = 'none';
				header.style.display = 'none'
			}

			startBtn.addEventListener('click', () => {
				closeMenuHeader()
				GameBoard.init()
			});
		})();

		function render() {
			let cells = [...GameBoard.gameBoardContainer.children];

			for (let i = 0; i < gameControler.getGameBoard().length; i++) {
				cells[i].style.color =
					gameControler.getGameBoard()[i] === 'X'
						? 'var(--color3)'
						: 'var(--color5)';
				cells[i].innerText = gameControler.getGameBoard()[i]
					? gameControler.getGameBoard()[i]
					: '';
			}
		}

		const playRound = (event) => {
			gameControler.playRound(event.target.dataset.position);
			GameBoard.changeTurnDisplay()
			render();
		};
	})();
})();
