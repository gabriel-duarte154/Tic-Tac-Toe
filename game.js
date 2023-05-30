const game = (function () {
	const gameControler = (() => {
		const gameBoard = (function () {
			let cells = new Array(9);
			return { cells };
		})();

		const Player = (name, mark) => {
			return { name, mark };
		};

		const Player1 = Player('Player1', 'X');
		const Player2 = Player('Player2', 'O');
		let curentPLayer;
		let curentMode;

		const setMode = (mode) => {
			curentMode = mode;
		};

		setMode('player');

		const setCurrentPlayer = () => {
			curentPLayer = curentPLayer === Player1 ? Player2 : Player1;
		};

		setCurrentPlayer();

		const playRound = (position) => {
			if (isEmpty(position)) {
				gameBoard.cells[position] = curentPLayer.mark;
				if (!gameStatus.checkForGameOver()) {
					setCurrentPlayer();
				}
			}
		};

		const isEmpty = (position) => {
			return gameBoard.cells[position] === undefined;
		};

		const gameStatus = (() => {
			const values = (start, stop, incrementer, nextCell) => {
				return { start, stop, incrementer, nextCell };
			};

			const row = values(0, 6, 3, 1);
			const column = values(0, 3, 1, 3);
			const fisrtDiagonal = values(0, 0, 1, 4);
			const secondDigonal = values(2, 2, 1, 2);

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
				console.log(`[row]--${verifyGameBoard(row)}`);
				console.log(`[column]--${verifyGameBoard(column)}`);
				console.log(`[first Diagonal]--${verifyGameBoard(fisrtDiagonal)}`);
				console.log(`[second Digonal]--${verifyGameBoard(secondDigonal)}`);

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
							console.log('\n');
							console.log(`Cell ${i}`)
							console.log(`Cell ${i + nextCell}`)
							console.log(`Cell ${i + nextCell * 2}`)
							console.log('\n');
							return true;
						}
					}
				}
				return false;
			};

			return { checkForGameOver };
		})();

		const getCurentMode = () => {
			return curentMode;
		};

		const getGameBoard = () => {
			return gameBoard.cells;
		};

		const getCurentPLayer = () => {
			return curentPLayer;
		};

		const isGameOver = () => {
			return gameStatus.checkForGameOver() ? true : false;
		};

		const getGameOverStatus = () => {
			return gameStatus.checkForGameOver();
		};

		return {
			getGameBoard,
			playRound,
			setMode,
			getCurentMode,
			getCurentPLayer,
			isGameOver,
			getGameOverStatus,
		};
	})();

	const ScreenControler = (() => {
		const GameBoard = (() => {
			const gameScreen = document.querySelector('.gameContainer');
			const gameBoardContainer = document.querySelector('.gameBoard');

			function creatCells() {
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

			const setGameScreen = () => {
				gameScreen.classList.toggle('hidden');
			};

			const changeTurnDisplay = () => {
				const playerMark = document.querySelector('.mark');
				playerMark.innerText = `${gameControler.getCurentPLayer().mark}`;
			};

			function init() {
				creatCells();
				setGameScreen();
				changeTurnDisplay();
			}

			function removeEvents() {
				let cells = [...gameBoardContainer.children];
				cells.forEach((cell) => {
					cell.removeEventListener('click', playRound);
				});
			}

			return {
				init,
				changeTurnDisplay,
				removeEvents,
				gameBoardContainer,
			};
		})();

		const initialScreen = (() => {
			const playerBtn = document.querySelector('#playerBtn');
			const IaBtn = document.querySelector('#iaBtn');
			const startBtn = document.querySelector('#startBtn');
			const initialPage = document.querySelector('.inital-page');

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
				initialPage.classList.add('hidden');
			}

			startBtn.addEventListener('click', () => {
				closeMenuHeader();
				GameBoard.init();
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
			GameBoard.changeTurnDisplay();
			render();
			if (gameControler.isGameOver()) finishGame();
		};

		const finishGame = () => {
			GameBoard.removeEvents();
			openGameOverScreen();
		};

		const openGameOverScreen = () => {
			const gameOverScreen = document.querySelector('.modal-gameOver');
			gameOverScreen.classList.remove('hidden');
			setGameOverMsg();
		};

		const setGameOverMsg = () => {
			const span = document.querySelector('.game-status');

			if (gameControler.getGameOverStatus() === 'winner') {
				span.textContent = `${gameControler.getCurentPLayer().mark} Wins!`;
			}
			if (gameControler.getGameOverStatus() === 'tie') {
				span.textContent = `It's a Tie.`;
			}
		};
	})();
})();
