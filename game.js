const game = (function () {
	const gameControler = (() => {
		const gameBoard = (function () {
			let cells = new Array(9);
			return { cells };
		})();

		const Player = (name, mark) => {
			return { name, mark };
		};

		const modeIa = (() => {
			const getPosibleMoves = () => {
				let posibelMoves = [];
				for (let index = 0; index < gameBoard.cells.length; index++) {
					if (isEmpty(index)) {
						posibelMoves.push(index);
					}
				}
				return posibelMoves;
			};
			const getIaMove = () => {
				let posibleMoves = getPosibleMoves();
				let index = Math.floor(Math.random() * posibleMoves.length);
				return posibleMoves[index];
			};

			return { getIaMove };
		})();

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

		const playRound = (position) => {
			if (isEmpty(position)) {
				gameBoard.cells[position] = curentPLayer.mark;
				verifyForGameOver();
			}
		};

		const verifyForGameOver = () => {
			if (gameStatus.checkForGameOver()) {
				gameStatistics.updateStatistics(gameStatus.getGameOverStatus());
				return;
			}
			setCurrentPlayer();
		};

		const gameStatistics = (() => {
			let xWins = 0;
			let oWins = 0;
			let tie = 0;

			const updateStatistics = (status) => {
				if (status === 'tie') tie++;
				if (status === 'winner') {
					curentPLayer.mark === 'X' ? xWins++ : oWins++;
				}
			};

			const reset = () => {
				xWins = 0;
				oWins = 0;
				tie = 0;
			};

			const getGameStatistics = () => {
				return { xWins, oWins, tie };
			};

			return { updateStatistics, getGameStatistics, reset };
		})();

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

			const getGameOverStatus = () => {
				if (checkForGameOver()) {
					return checkForWinner() ? 'winner' : 'tie';
				}
			};

			const checkForGameOver = () => {
				return checkForWinner() || checkForTie();
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

			return { checkForGameOver, getGameOverStatus };
		})();

		const setInitialConfigs = () => {
			curentPLayer = Player1;
		};

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
			return gameStatus.checkForGameOver();
		};

		const getGameOverStatus = () => {
			return gameStatus.getGameOverStatus();
		};

		const getGameStatistics = () => {
			return gameStatistics.getGameStatistics();
		};

		const resetGameBoard = () => {
			gameBoard.cells = new Array(9);
		};

		const resetStatistics = () => {
			return gameStatistics.reset();
		};

		const getMode = () => {
			return curentMode;
		};

		setInitialConfigs();

		return {
			getGameBoard,
			playRound,
			setMode,
			getCurentMode,
			getCurentPLayer,
			isGameOver,
			getGameOverStatus,
			resetGameBoard,
			setInitialConfigs,
			getGameStatistics,
			resetStatistics,
			getMode,
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
				gameScreen.classList.remove('hidden');
			};

			const closeGameScreen = () => {
				gameScreen.classList.add('hidden');
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

			function resetGameBoard() {
				gameBoardContainer.innerHTML = '';
			}

			return {
				init,
				changeTurnDisplay,
				removeEvents,
				resetGameBoard,
				closeGameScreen,
				gameBoardContainer,
			};
		})();

		const gameStatistics = (() => {
			const statisticsContainers = document.querySelectorAll('.score');

			const updateStatisticsDisplay = () => {
				let statistics = gameControler.getGameStatistics();
				statisticsContainers.forEach((container) => {
					container.textContent = `${statistics[container.id]}`;
				});
			};

			return { updateStatisticsDisplay };
		})();

		const initialScreen = (() => {
			const playerBtn = document.querySelector('#playerBtn');
			const IaBtn = document.querySelector('#iaBtn');
			const startBtn = document.querySelector('#startBtn');
			const initialPage = document.querySelector('.inital-page');
			const modeMenu = document.querySelector('.menu-wrapper');

			const iaMenu = (() => {
				const menu = document.querySelector('.menu-ia-mode');

				const open = () => {
					menu.classList.remove('hidden');
				};

				const close = () => {
					menu.classList.add('hidden');
				};

				return { open, close };
			})();

			function toggleBtn() {
				if (gameControler.getCurentMode() === 'player') {
					playerBtn.classList.add('active');
					IaBtn.classList.remove('active');
				} else {
					playerBtn.classList.remove('active');
					IaBtn.classList.add('active');
				}
			}

			const InitializeGame = () => {
				if (gameControler.getMode() === 'ia') {
					startIaMode();
					return;
				}
				startPlayerMode();
			};

			const startIaMode = () => {
				closeModeMenu();
				iaMenu.open();
			};

			const startPlayerMode = () => {
				closeMenuHeader();
				GameBoard.init();
			};

			playerBtn.addEventListener('click', () => {
				gameControler.setMode('player');
				toggleBtn();
			});
			IaBtn.addEventListener('click', () => {
				gameControler.setMode('ia');
				toggleBtn();
			});

			toggleBtn();

			function closeModeMenu() {
				modeMenu.classList.add('hidden');
			}

			function closeMenuHeader() {
				initialPage.classList.add('hidden');
			}

			function openMenuHeader() {
				initialPage.classList.remove('hidden');
			}

			startBtn.addEventListener('click', InitializeGame);

			return { openMenuHeader };
		})();

		const gameOver = (() => {
			const gameOverScreen = document.querySelector('.modal-gameOver');
			const resetBtn = document.querySelector('.reset-btn');
			const bakcMainBtn = document.querySelector('.back-main-btn');

			const finishGame = () => {
				GameBoard.removeEvents();
				openGameOverScreen();
				setGameOverMsg();
				gameStatistics.updateStatisticsDisplay();
			};

			const openGameOverScreen = () => {
				gameOverScreen.classList.remove('hidden');
			};

			const closeGameOverScreen = () => {
				gameOverScreen.classList.add('hidden');
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

			const newGameBoard = () => {
				resetGame();
				GameBoard.init();
			};

			const backMainMenu = () => {
				resetGame();
				gameControler.resetStatistics();
				gameStatistics.updateStatisticsDisplay();
				GameBoard.closeGameScreen();
				initialScreen.openMenuHeader();
			};

			const resetGame = () => {
				gameControler.setInitialConfigs();
				gameControler.resetGameBoard();
				GameBoard.resetGameBoard();
				closeGameOverScreen();
			};

			resetBtn.addEventListener('click', newGameBoard);
			bakcMainBtn.addEventListener('click', backMainMenu);

			return { finishGame };
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
			if (gameControler.isGameOver()) gameOver.finishGame();
		};
	})();
})();
