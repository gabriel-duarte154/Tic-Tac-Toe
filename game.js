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

		const playRound = (position) => {
			if (isGameOver()) return;
			if (curentMode === 'player') {
				playerMode(position);
			}
			if (curentMode === 'ia') {
				modeIa.playRound(position);
			}
			verifyForGameOver();
		};

		const playerMode = (position) => {
			if (isEmpty(position)) {
				addMark(position);
			}
			setCurrentPlayer();
		};

		const setCurrentPlayer = () => {
			if (isGameOver()) return;
			curentPLayer = curentPLayer === Player1 ? Player2 : Player1;
		};

		const addMark = (position) => {
			gameBoard.cells[position] = curentPLayer.mark;
		};

		const verifyForGameOver = () => {
			if (isGameOver()) {
				gameStatistics.update(gameStatus.getGameOverStatus());
			}
		};

		const isEmpty = (position) => {
			return gameBoard.cells[position] === undefined;
		};

		const modeIa = (() => {
			let iaMakeFirstMove = false;
			let iaTurn = false;

			const activeIaTurn = () => {
				iaTurn = true;
			};

			const desativeIaTurn = () => {
				iaTurn = false;
			};

			const setIaTurn = () => {
				iaMakeFirstMove = iaMakeFirstMove ? false : true;
			};

			const iaPlayFirst = () => {
				return iaMakeFirstMove;
			};

			const playRound = (position) => {
				if (iaTurn) {
					iaMove();
					return;
				}
				playerMove(position);
			};

			const iaMove = () => {
				addMark(getIaMove());
				desativeIaTurn();
				setCurrentPlayer();
				ScreenControler.render();
				if (isGameOver()) {
					ScreenControler.gameOver.finishGame();
				}
					ScreenControler.updateTurnDisplay()
					ScreenControler.addCellsEvents();
			};

			const playerMove = (position) => {
				if (isEmpty(position)) {
					addMark(position);
					setCurrentPlayer();
					if (!isGameOver()) {
						ScreenControler.removeCellEvents();
						setTimeout(() => {
							activeIaTurn();
							playRound();
						}, 500)
						
					}
				}
			};

			const getIaMove = () => {
				let posibleMoves = getPosibleMoves();
				let index = Math.floor(Math.random() * posibleMoves.length);
				return posibleMoves[index];
			};

			const getPosibleMoves = () => {
				let posibelMoves = [];
				for (let index = 0; index < gameBoard.cells.length; index++) {
					if (isEmpty(index)) {
						posibelMoves.push(index);
					}
				}
				return posibelMoves;
			};

			return {
				playRound,
				setIaTurn,
				iaPlayFirst,
				activeIaTurn,
				desativeIaTurn,
			};
		})();

		const gameStatistics = (() => {
			let xWins = 0;
			let oWins = 0;
			let tie = 0;

			const update = (status) => {
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

			const getStatistics = () => {
				return { xWins, oWins, tie };
			};

			return { update, getStatistics, reset };
		})();

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

		const setIaconfigs = () => {
			if (modeIa.iaPlayFirst()) {
				modeIa.activeIaTurn();
			} else {
				modeIa.desativeIaTurn();
			}
		};

		const setInitialConfigs = () => {
			curentPLayer = Player1;
			modeIa.desativeIaTurn();
		};

		setInitialConfigs();

		const getCurentMode = () => {
			return curentMode;
		};

		const getGameBoard = () => {
			return gameBoard.cells;
		};

		const resetGameBoard = () => {
			gameBoard.cells = new Array(9);
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

		const getStatistics = () => {
			return gameStatistics.getStatistics();
		};

		const resetStatistics = () => {
			return gameStatistics.reset();
		};

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
			getStatistics,
			resetStatistics,
			setIaconfigs,
			modeIa,
		};
	})();

	const ScreenControler = (() => {
		const initialScreen = (() => {
			const playerBtn = document.querySelector('#playerBtn');
			const IaBtn = document.querySelector('#iaBtn');
			const startBtn = document.querySelector('#startBtn');
			const initialPage = document.querySelector('.inital-page');
			const modeMenu = document.querySelector('.menu-wrapper');

			function toggleBtn() {
				if (gameControler.getCurentMode() === 'player') {
					playerBtn.classList.add('active');
					IaBtn.classList.remove('active');
				} else {
					playerBtn.classList.remove('active');
					IaBtn.classList.add('active');
				}
			}

			toggleBtn();

			const InitializeGame = () => {
				if (gameControler.getCurentMode() === 'ia') {
					openIaMenu();
					return;
				}
				startPlayerMode();
			};

			const startPlayerMode = () => {
				closeInitialPage();
				GameBoard.init();
			};

			const openIaMenu = () => {
				closeModeMenu();
				iaMenu.open();
			};

			playerBtn.addEventListener('click', () => {
				gameControler.setMode('player');
				toggleBtn();
			});
			IaBtn.addEventListener('click', () => {
				gameControler.setMode('ia');
				toggleBtn();
			});

			startBtn.addEventListener('click', InitializeGame);

			const iaMenu = (() => {
				const menu = document.querySelector('.menu-ia-mode');
				const dificultiesBtns = document.querySelector(
					'.dificulties-container'
				);
				const markContainer = document.querySelector('.mark-container');
				const BtnX = document.querySelector('#btn-x');
				const BtnO = document.querySelector('#btn-o');

				const startIaMode = (event) => {
					if (event.target.matches('.dificult')) {
						close();
						closeInitialPage();
						GameBoard.init();
						if (gameControler.modeIa.iaPlayFirst()) {
							gameControler.modeIa.activeIaTurn();
							gameControler.playRound();
							render();
						}
					}
				};

				const open = () => {
					openScreen(menu);
					toggleBtn();
				};

				const close = () => {
					closeScreen(menu);
				};

				const setMark = () => {
					gameControler.modeIa.setIaTurn();
					console.log(gameControler.modeIa.iaPlayFirst());
					toggleBtn();
				};

				const toggleBtn = () => {
					if (gameControler.modeIa.iaPlayFirst()) {
						BtnO.classList.add('active-option');
						BtnX.classList.remove('active-option');
					} else {
						BtnO.classList.remove('active-option');
						BtnX.classList.add('active-option');
					}
				};

				dificultiesBtns.addEventListener('click', startIaMode);
				markContainer.addEventListener('click', setMark);

				return { open, close };
			})();

			function closeModeMenu() {
				closeScreen(modeMenu);
			}

			function openModeMenu() {
				openScreen(modeMenu);
			}

			function closeInitialPage() {
				closeScreen(initialPage);
			}

			function openInitialPage() {
				openScreen(initialPage);
			}

			return { openInitialPage, openModeMenu };
		})();

		const GameBoard = (() => {
			const gameScreen = document.querySelector('.gameContainer');
			const gameBoardContainer = document.querySelector('.gameBoard');

			function creatCells() {
				let cells = [];
				for (let i = 0; i < gameControler.getGameBoard().length; i++) {
					let newCell = document.createElement('div');
					newCell.dataset.position = i;
					cells.push(newCell);
				}
				appendELements(cells);
				addEvents();
			}

			function appendELements(cells) {
				cells.forEach((cell) => {
					gameBoardContainer.appendChild(cell);
				});
			}

			const setGameScreen = () => {
				openScreen(gameScreen);
			};

			const closeGameScreen = () => {
				closeScreen(gameScreen);
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

			function addEvents() {
				let cells = [...gameBoardContainer.children];
				cells.forEach((cell) => {
					cell.addEventListener('click', playRound);
				});
			}

			function resetGameBoard() {
				gameBoardContainer.innerHTML = '';
			}

			return {
				init,
				changeTurnDisplay,
				removeEvents,
				addEvents,
				resetGameBoard,
				closeGameScreen,
				gameBoardContainer,
			};
		})();

		const gameStatistics = (() => {
			const statisticsContainers = document.querySelectorAll('.score');

			const updateStatisticsDisplay = () => {
				let statistics = gameControler.getStatistics();
				statisticsContainers.forEach((container) => {
					container.textContent = `${statistics[container.id]}`;
				});
			};

			return { updateStatisticsDisplay };
		})();

		const gameOver = (() => {
			const gameOverScreen = document.querySelector('.modal-gameOver');
			const resetBtn = document.querySelector('.reset-btn');
			const backMainBtn = document.querySelector('.back-main-btn');

			const finishGame = () => {
				GameBoard.removeEvents();
				openGameOverScreen();
				setGameOverMsg();
				gameStatistics.updateStatisticsDisplay();
			};

			const openGameOverScreen = () => {
				openScreen(gameOverScreen);
			};

			const closeGameOverScreen = () => {
				closeScreen(gameOverScreen);
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

			const reset = () => {
				resetGame();
				GameBoard.init();
				gameControler.setIaconfigs();
				if (gameControler.modeIa.iaPlayFirst()) {
					gameControler.playRound();
					render();
				}
			};

			const backMainMenu = () => {
				resetGame();
				gameControler.resetStatistics();
				gameStatistics.updateStatisticsDisplay();
				GameBoard.closeGameScreen();
				initialScreen.openInitialPage();
				initialScreen.openModeMenu();
			};

			const resetGame = () => {
				gameControler.resetGameBoard();
				GameBoard.resetGameBoard();
				gameControler.setInitialConfigs();
				closeGameOverScreen();
			};

			resetBtn.addEventListener('click', reset);
			backMainBtn.addEventListener('click', backMainMenu);

			return { finishGame };
		})();

		const openScreen = (screen) => {
			screen.classList.remove('hidden');
		};

		const closeScreen = (screen) => {
			screen.classList.add('hidden');
		};

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

		const addCellsEvents = () => {
			return GameBoard.addEvents();
		}

		const removeCellEvents = () => {
			return GameBoard.removeEvents();
		}

		const updateTurnDisplay = () => {
			return GameBoard.changeTurnDisplay();
		}

		return {
			render,
			addCellsEvents,
			removeCellEvents,
			updateTurnDisplay,
			gameOver
		}
	})();
})();
