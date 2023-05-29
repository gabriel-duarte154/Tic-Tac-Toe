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

		const setCurrentPlayer = () => {
			curentPLayer = curentPLayer === Player1 ? Player2 : Player1;
		};

		const playRound = (position) => {
			if (isEmpty(position)) {
				setCurrentPlayer();
				gameBoard.cells[position] = curentPLayer.mark;

				if (gameStatus.checkForGameOver()) {
					endGame(gameStatus.checkForGameOver());
				}
			}
		};

		const isEmpty = (position) => {
			return gameBoard.cells[position] === undefined;
		};

		const getGameBoard = () => {
			return gameBoard.cells;
		};

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
						return (
							gameBoard.cells[i] === gameBoard.cells[i + nextCell] &&
							gameBoard.cells[i] === gameBoard.cells[i + nextCell * 2]
						);
					}
				}
				return false;
			};

			return { checkForGameOver };
		})();

		return { getGameBoard, playRound };
	})();

	const ScreenControler = (() => {
		const gameBoardContainer = document.querySelector('.gameboard');

		function creatCellContainer() {
			let divs = [];
			for (let i = 0; i < gameControler.getGameBoard().length; i++) {
				let newDiv = document.createElement('div');
				newDiv.dataset.position = i;
				newDiv.addEventListener('click', playRound);
				divs.push(newDiv);
			}
			appendCell(divs);
		}

		const playRound = (event) => {
			gameControler.playRound(event.target.dataset.position);
			render();
		};

		function appendCell(cells) {
			cells.forEach((cell) => {
				gameBoardContainer.appendChild(cell);
			});
		}

		function render() {
			let divs = [...gameBoardContainer.children];

			for (let i = 0; i < gameControler.getGameBoard().length; i++) {
				divs[i].style.color =
					gameControler.getGameBoard()[i] === 'X'
						? 'var(--color3)'
						: 'var(--color5)';
				divs[i].innerText = gameControler.getGameBoard()[i]
					? gameControler.getGameBoard()[i]
					: '';
			}
		}
		creatCellContainer();
	})();
})();
