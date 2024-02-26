document.addEventListener("DOMContentLoaded", function() {

	var path = "http://localhost:8080/tictactoe/tictactoeserver/";
	var baseUrl = "http://localhost:8080/TicTacToe";

	var gameCode;
	var gameUID;
	var playerTile;
	var playerScore = 0;
	var playerUID;
	var listData;
	var gameData;

	function generateGameCode() {
		// Generate a random 6-digit code
		var code = Math.floor(100000 + Math.random() * 900000);
		return code;
	}

	function generateUID() {
		var uid = self.crypto.randomUUID();
		return uid;
	}

	async function getGameUID() {
		let url = `${baseUrl}/webapi/getUID/${gameCode}`;
		return await fetch(url).then(response => response.text()).catch(error => {
			console.error('Error fetching data: ', error)
		});
	}
	async function getPlayerHistory() {
		let url = `${baseUrl}/webapi/listGames/player/${playerUID}`;
		try {
			const response = await fetch(url);
			const data = await response.json(); // Assuming the response is JSON
			return data; // Return the array as it is
		} catch (error) {
			console.error('Error fetching data: ', error);
			return []; // Return an empty array in case of error
		}
	}

	async function getGameHistory(item) {
		let url = `${baseUrl}/webapi/listGames/game/${item}`;
		try {
			const response = await fetch(url);
			const data = await response.json(); // Assuming the response is JSON
			return data; // Return the array as it is
		} catch (error) {
			console.error('Error fetching data: ', error);
			return []; // Return an empty array in case of error
		}
	}

	async function checkGameExistence() {
		let checkUrl = `${path}check?key=${gameCode}`;
		try {
			const response = await fetch(checkUrl);

			if (!response.ok) {
				throw new Error(`Failed to check game existence: ${response.status}`);
			}

			const gameExists = await response.json(); // Assuming the server responds with a JSON object indicating existence

			return gameExists;
		} catch (error) {
			console.error('Error checking game existence:', error.message);
			return false; // Return false in case of an error
		}
	}

	async function createGame() {
		gameUID = generateUID();
		let createUrl = `${path}createGame?key=${gameCode}`;
		try {
			fetch(createUrl)
				.then(res => res.text())
				.then(async data => {
					console.log("DATA: " + data);
					playerTile = data;
					console.log("PlayerTile: " + playerTile);
					if (playerTile == "X") {
						fetch(`${baseUrl}/webapi/createUID`, {
							headers: {
								"Content-Type": "application/json",
							},
							method: "POST",
							body: JSON.stringify({
								"gameKey": gameCode,
								"gameUID": gameUID,
							}),
						}).then(saveResponse => {
							if (saveResponse.ok) {
								return saveResponse.json();
							} else {
								throw new Error('Error in saving move to endpoint');
							}
						})
							.then(savedData => {
								console.log('UID: ', savedData);
							})
							.catch(error => {
								console.error('Error:', error);
							});

					}
					else if (playerTile == "O") {
						gameUID = await getGameUID();
						console.log("Game UID: " + gameUID);
					}
					fetch(`${baseUrl}/webapi/save/player`, {
						headers: {
							"Content-Type": "application/json",
						},
						method: "POST",
						body: JSON.stringify({
							"gameUID": gameUID,
							"playerID": playerUID,
						}),
					}).then(saveResponse => {
						if (saveResponse.ok) {
							return saveResponse.json();
						} else {
							throw new Error('Error in saving game to endpoint');
						}
					})
						.then(savedData => {
							console.log('Game saved:', savedData);
						})
						.catch(error => {
							console.error('Error:', error);
						});
				});



		} catch (error) {
			console.error("Error creating game:", error.message);
		}
	}

	function reset() {
		playerTile = null;
		var resetUrl = `${path}reset?key=${gameCode}`;
		// Make a GET request to the servlet
		fetch(resetUrl)
			.then(response => response.json())
			.then(data => {
				// Handle the response data here
				console.log(data);
			})
			.catch(error => {
				console.error(error);
			});
	}

	function createPopUp() {
		// Create the popup div
		var popupDiv = document.createElement('div');
		popupDiv.id = 'popup';
		popupDiv.style.display = 'none';

		// Create the paragraph for the popup text
		var popupText = document.createElement('p');
		popupText.id = 'popupText';

		// Create the close button for the popup
		var closePopupBtn = document.createElement('button');
		closePopupBtn.id = 'closePopup';
		closePopupBtn.textContent = 'Close';

		// Append the paragraph and button to the popup div
		popupDiv.appendChild(popupText);
		popupDiv.appendChild(closePopupBtn);

		// Append the popup div to the document body
		document.body.appendChild(popupDiv);
	}

	function createExitPopUp() {
		// Create the popup div
		var exitPopupDiv = document.createElement('div');
		exitPopupDiv.id = 'exitPopup';
		exitPopupDiv.style.display = 'none';

		// Create the paragraph for the popup text
		var exitPopupText = document.createElement('p');
		exitPopupText.id = 'exitPopupText';

		// Create the close button for the popup
		var yesExitPopupBtn = document.createElement('button');
		yesExitPopupBtn.id = 'yesExitPopup';
		yesExitPopupBtn.textContent = 'Yes';

		// Create the No button for the popup
		var noExitPopupBtn = document.createElement('button');
		noExitPopupBtn.id = 'noExitPopup';
		noExitPopupBtn.textContent = 'No';

		// Append the paragraph and button to the popup div
		exitPopupDiv.appendChild(exitPopupText);
		exitPopupDiv.appendChild(yesExitPopupBtn);
		exitPopupDiv.appendChild(noExitPopupBtn);

		// Append the popup div to the document body
		document.body.appendChild(exitPopupDiv);
	}

	function openPopUp() {
		var popup = document.getElementById('popup');
		var popupText = document.getElementById('popupText');
		var closePopupBtn = document.getElementById('closePopup');

		popupText.innerText = "You are in a game";
		popup.style.display = 'block';

		// Close the popup when the close button is clicked
		closePopupBtn.addEventListener('click', function() {
			popup.style.display = 'none';
		});
	}

	function openExitPopUp(callback) {
		var exitPopup = document.getElementById('exitPopup');
		var exitPopupText = document.getElementById('exitPopupText');
		var noExitPopupBtn = document.getElementById('noExitPopup');
		var yesExitPopupBtn = document.getElementById('yesExitPopup')

		exitPopupText.innerText = "Reset Game?";
		exitPopup.style.display = 'block';

		yesExitPopupBtn.addEventListener('click', () => {
			exitPopup.style.display = 'none';
			callback(true);
		});

		noExitPopupBtn.addEventListener('click', () => {
			exitPopup.style.display = 'none';
			callback(false);
		});
	}

	function createModal(modalId, h2Text, inputId, placeholder, submitFunction) {
		var overlayDiv = document.createElement('div');
		overlayDiv.className = 'overlay';
		overlayDiv.id = 'overlay';

		var modalContentDiv = document.createElement('div');
		modalContentDiv.className = 'modal';
		modalContentDiv.id = modalId;

		var h2Element = document.createElement('h2');
		h2Element.innerHTML = h2Text;

		var userInput = document.createElement("input");
		userInput.type = "text";
		userInput.placeholder = placeholder;
		userInput.id = inputId;

		var btnDiv = document.createElement('div');
		btnDiv.className = 'button-container';

		var cancelBtn = document.createElement('button');
		cancelBtn.className = 'sub-can-btn button';
		cancelBtn.type = 'reset';
		cancelBtn.formNoValidate = true;
		cancelBtn.innerHTML = 'Cancel';
		cancelBtn.onclick = function() {
			userInput.value = '';
			closeModal(modalId);
		};

		var submitBtn = document.createElement('button');
		submitBtn.className = 'sub-can-btn button';
		submitBtn.type = 'submit';
		submitBtn.innerHTML = 'Submit';

		// Add an event listener to the submit button
		submitBtn.addEventListener('click', async function(event) {
			submitFunction();
		});

		btnDiv.appendChild(cancelBtn);
		btnDiv.appendChild(submitBtn);

		modalContentDiv.appendChild(h2Element);
		modalContentDiv.appendChild(userInput);
		modalContentDiv.appendChild(btnDiv);

		document.body.appendChild(overlayDiv);
		document.body.appendChild(modalContentDiv);
	}

	async function gameCodeModalSubmit() {
		var inputValue = document.getElementById("userInput").value.trim();
		if (inputValue === '' || inputValue == null) {
			inputValue = generateGameCode();
		}
		gameCode = inputValue;
		closeModal("createModal");
		openModal("UIDModal");
	}

	async function UIDModalSubmit() {
		var inputValue = document.getElementById("inputUID").value.trim();
		console.log("INPUT:" + inputValue);
		if (inputValue === '' || inputValue == null) {
			inputValue = generateUID();
		}
		playerUID = inputValue;
		var gameExists = await checkGameExistence();
		// Check if the response from the servlet is true
		if (gameExists === true) {
			UIDText.innerHTML = `Player UID: ${playerUID}`;
			codeText.innerHTML = `CODE: ${gameCode}`;
			playerText.innerHTML = "Spectator";
			closeModal("UIDModal");
		} else {
			if (playerTile == null) {
				createGame();
				UIDText.innerHTML = `Player UID: ${playerUID}`;
				document.querySelector('.hst-btn').addEventListener('click', async () => {
					historyModal();
				});
				statusDisplay.innerHTML = gameIsReady();
				userInput.value = '';
				codeText.innerHTML = `CODE: ${gameCode}`;
				closeModal("UIDModal");

			}
			else {
				openPopUp();
			}
		}
	}

	async function historyModal() {
		listData = await getPlayerHistory();
		console.log("List: " + listData);
		var overlayDiv = document.createElement('div');
		overlayDiv.className = 'overlay-history';
		overlayDiv.id = 'overlay-history';

		var modalContentDiv = document.createElement('div');
		modalContentDiv.className = 'modal-history';
		modalContentDiv.id = 'modalHistory';

		var h2Element = document.createElement('h2');
		h2Element.innerHTML = "History";

		var closeButton = document.createElement('button');
		closeButton.innerHTML = 'X';
		closeButton.className = 'close-button';
		closeButton.onclick = function() {
			document.body.removeChild(document.getElementById("overlay-history"));
			document.body.removeChild(document.getElementById("modalHistory"));
		};

		var listContainer = document.createElement('ul'); // Creating the list container

		// Populate the list
		listData.forEach(function(item) {
			var listItem = document.createElement('li');
			listItem.innerHTML = item;

			// Add onclick listener to each list item
			listItem.addEventListener('click', async function() {
				// Define what should happen when a list item is clicked
				// For example, you can log the clicked item's text to console
				gameData = await getGameHistory(item);
				console.log("Clicked item: " + item);
				gameHistoryModal(gameData);
				// Add more actions as needed
			});

			listContainer.appendChild(listItem);
		});

		modalContentDiv.appendChild(h2Element);
		modalContentDiv.appendChild(closeButton);
		modalContentDiv.appendChild(listContainer);

		document.body.appendChild(overlayDiv);
		document.body.appendChild(modalContentDiv);

	}

	async function gameHistoryModal(historyGame) {

		console.log("GAME:" + historyGame);

		var overlayDiv = document.createElement('div');
		overlayDiv.className = 'overlay-game-history';
		overlayDiv.id = 'overlay-game-history';

		var modalContentDiv = document.createElement('div');
		modalContentDiv.className = 'modal-game-history';
		modalContentDiv.id = 'modalGameHistory';

		var h2Element = document.createElement('h2');
		h2Element.innerHTML = "Game History";

		var closeButton = document.createElement('button');
		closeButton.innerHTML = 'X';
		closeButton.className = 'close-button';
		closeButton.onclick = function() {
			document.body.removeChild(document.getElementById("overlay-game-history"));
			document.body.removeChild(document.getElementById("modalGameHistory"));
		};



		if (historyGame == [] || historyGame == "" || historyGame == null) {
			var noMove = document.createElement('p');
			noMove.innerHTML = "No moves yet";

			modalContentDiv.appendChild(h2Element);
			modalContentDiv.appendChild(closeButton);
			modalContentDiv.appendChild(noMove);
		}

		else {
			var table = document.createElement('table');
			var thead = document.createElement('thead');
			var tbody = document.createElement('tbody');

			// Headers
			var headers = ['Room Code', 'Game UID', 'Player UID', 'Symbol', 'Location', 'Date'];
			var headerRow = document.createElement('tr');
			headers.forEach(headerText => {
				var th = document.createElement('th');
				th.appendChild(document.createTextNode(headerText));
				headerRow.appendChild(th);
			});
			thead.appendChild(headerRow);

			// Data
			historyGame.forEach(function(line) {
				console.log("Line: " + line);
				var rowData = line.split(', ');
				var row = document.createElement('tr');
				rowData.forEach(cellData => {
					var cell = document.createElement('td');
					cell.appendChild(document.createTextNode(cellData.split(': ')[1]));
					row.appendChild(cell);
				});
				tbody.appendChild(row);
			});

			table.appendChild(thead);
			table.appendChild(tbody);

			modalContentDiv.appendChild(h2Element);
			modalContentDiv.appendChild(closeButton);
			modalContentDiv.appendChild(table);
		}

		document.body.appendChild(overlayDiv);
		document.body.appendChild(modalContentDiv);
	}


	function openModal(modalId) {
		document.getElementById(modalId).style.display = 'block';
		document.getElementById('overlay').style.display = 'block';
	}

	function closeModal(modalId) {
		document.getElementById(modalId).style.display = 'none';
		document.getElementById('overlay').style.display = 'none';
	}

	// UID Modal
	createModal("createModal", "Enter Game Code", "userInput", "(Auto-generate if empty)", gameCodeModalSubmit);
	createModal("UIDModal", "Enter your UID", "inputUID", "(Create new if empty)", UIDModalSubmit);
	createPopUp();
	createExitPopUp();

	// Create section element
	const section = document.createElement('section');

	// Create h1 element with class "game--title"
	const h1 = document.createElement('h1');
	h1.className = 'game--title';
	h1.textContent = 'Tic-Tac-Toe';

	var UIDText = document.createElement('p');
	UIDText.className = 'UIDPlayer';
	UIDText.innerHTML = 'Player UID: '

	var subtitleDiv = document.createElement('div');
	subtitleDiv.id = 'subtitleDiv';

	const codeText = document.createElement('h2');
	codeText.className = 'game--subtitle';
	codeText.innerHTML = "CODE: ";

	var subtitleRow = document.createElement('div');
	subtitleRow.id = 'subtitleRow';

	const scoreText = document.createElement('h2');
	scoreText.className = 'game--subtitle';
	const score = () => `Score: ${playerScore}`;
	scoreText.innerHTML = score();

	const playerText = document.createElement('h2');
	playerText.className = 'game--subtitle';
	playerText.innerHTML = "Player: ";

	subtitleRow.appendChild(playerText);
	subtitleRow.appendChild(scoreText);

	subtitleDiv.appendChild(codeText);
	subtitleDiv.appendChild(subtitleRow);

	// Create game container div
	const gameContainer = document.createElement('div');
	gameContainer.className = 'game--container';

	// Create 9 cells inside the game container
	for (let i = 0; i < 9; i++) {
		const cell = document.createElement('div');
		cell.className = 'cell';
		cell.setAttribute('data-cell-index', i);
		gameContainer.appendChild(cell);
	}

	// Create h2 element with class "game--status"
	const h2 = document.createElement('h2');
	h2.className = 'game--status';

	var gameButtons = document.createElement('div');
	gameButtons.id = 'gameButtons';

	// Create history button
	const historyButton = document.createElement('button');
	historyButton.className = 'game-button hst-btn';
	historyButton.textContent = 'History';

	// Create create button
	const createButton = document.createElement('button');
	createButton.className = 'game-button crt-btn';
	createButton.textContent = 'Create/Join';

	// Create reset button
	const resetButton = document.createElement('button');
	resetButton.className = 'game-button rst-btn';
	resetButton.textContent = 'Reset';

	// Create start button
	const startButton = document.createElement('button');
	startButton.className = 'game-button start-btn';
	startButton.textContent = 'Start';

	gameButtons.appendChild(historyButton);
	gameButtons.appendChild(createButton);
	gameButtons.appendChild(resetButton);
	gameButtons.appendChild(startButton);

	// Append all elements to the section
	section.appendChild(h1);
	section.appendChild(UIDText);
	section.appendChild(subtitleDiv);
	section.appendChild(gameContainer);
	section.appendChild(h2);
	section.appendChild(gameButtons);

	// Append the section to the body of the HTML document
	document.body.appendChild(section);

	window.addEventListener('beforeunload', function(event) {
		if (playerTile == 'X' || playerTile == 'O') {
			reset();
		}
	});

	const statusDisplay = document.querySelector('.game--status');

	const welcome = () => `Welcome to Tic Tac Toe`;
	const gameNotExisting = () => `Game not Ready. Make sure there both players are ready`;
	const gameReset = () => `Game was Reset`;
	const gameIsReady = () => `Press Start.`;


	statusDisplay.innerHTML = welcome();

	var intervalId;

	document.querySelector('.crt-btn').addEventListener('click', async () => {
		clearInterval(intervalId);
		if (gameCode == null || gameCode == '') {
			openModal("createModal");
		}
		else {
			if (playerTile == null) {
				createGame();
				statusDisplay.innerHTML = gameIsReady();
				userInput.value = '';
				codeText.innerHTML = `CODE: ${gameCode}`;
			}
			else {
				var popup = document.getElementById('popup');
				var popupText = document.getElementById('popupText');
				var closePopupBtn = document.getElementById('closePopup');

				popupText.innerText = "You are in the game.";
				popup.style.display = 'block';

				// Close the popup when the close button is clicked
				closePopupBtn.addEventListener('click', function() {
					popup.style.display = 'none';
				});
			}
		}
	});


	document.querySelector('.rst-btn').addEventListener('click', async () => {
		if (playerTile == 'X' || playerTile == "O") {
			openExitPopUp((isReset) => {
				console.log(isReset);
				if (isReset) {
					clearInterval(intervalId);
					reset();
					gameUID = "";
					playerText.innerHTML = 'Player: ';
					statusDisplay.innerHTML = gameReset();
				}
			});
		}

	});

	document.querySelector('.start-btn').addEventListener('click', async () => {

		const gameExists = await checkGameExistence();

		if (gameExists) {
			if (playerTile == 'X' || playerTile == 'O') {
				playerText.innerHTML = `Player: ${playerTile}`
			}
			else {
				playerText.innerHTML = `Player: Spectator`
			}


			let currentPlayer = "X";
			let gameState = ["", "", "", "", "", "", "", "", ""];
			const winningMessage = () => `Player ${currentPlayer} has won!`;
			const drawMessage = () => `Game ended in a draw!`;
			const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

			const winningConditions = [
				[0, 1, 2],
				[3, 4, 5],
				[6, 7, 8],
				[0, 3, 6],
				[1, 4, 7],
				[2, 5, 8],
				[0, 4, 8],
				[2, 4, 6]
			];

			let roundWon = false;

			// Function to update the game board based on the current game state
			function updateBoard() {
				document.querySelectorAll('.cell').forEach((cell, index) => {
					cell.innerHTML = gameState[index];
				});
				statusDisplay.innerHTML = currentPlayerTurn();
			}

			// Function to initialize the game state from local storage
			async function getBoard() {
				var gameExists = await checkGameExistence();
				if (gameExists) {
					try {
						const response = await fetch(`${path}board?key=${gameCode}`);

						if (!response.ok) {
							throw new Error(`Failed to fetch game board: ${response.status}`);
						}

						const boardString = await response.text();
						gameState = boardString.split(':').slice(0, 9); // Assuming the board is represented as "X:O:X:O:X:O:X:O:X:"
						updateBoard();
						handleResultValidation();
						// Count the number of 'X' and 'O' in the initial board state
						const countX = gameState.filter(tile => tile === 'X').length;
						const countO = gameState.filter(tile => tile === 'O').length;

						// Set the currentPlayer based on the counts
						currentPlayer = countX > countO ? 'O' : 'X';

					} catch (error) {
						console.error('Error initializing game:', error.message);
					}
				}
				else {
					handleExitEvent();
				}
			}

			intervalId = setInterval(getBoard, 100); // Get Board every 100ms
			statusDisplay.innerHTML = currentPlayerTurn();

			function handleCellClick(clickedCellEvent) {
				const clickedCell = clickedCellEvent.target;
				const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

				if (gameState[clickedCellIndex] !== "" || roundWon)
					return;

				handleCellPlayed(clickedCell, clickedCellIndex);

			}

			// Function to handle playing a cell and updating the game state on the server
			async function handleCellPlayed(clickedCell, clickedCellIndex) {
				if (gameState[clickedCellIndex] !== "" || roundWon || playerTile != currentPlayer) {
					return;
				}

				try {
					// Make a POST request to the server to execute the move
					const response = await fetch(`${path}move?key=${gameCode}&tile=${currentPlayer}&y=${Math.floor(clickedCellIndex / 3)}&x=${clickedCellIndex % 3}`);

					if (!response.ok) {
						throw new Error(`Failed to execute move: ${response.status}`);
					}

					// Update the local gameState and board if the move is successful
					gameState[clickedCellIndex] = currentPlayer;
					clickedCell.innerHTML = currentPlayer;
					updateBoard();

					console.log("Game Code: " + gameCode);

					fetch(`${baseUrl}/webapi/save/game`, {
						headers: {
							"Content-Type": "application/json",
						},
						method: "POST",
						body: JSON.stringify({
							"gameKey": gameCode,
							"gameUID": gameUID,
							"playerID": playerUID,
							"symbol": playerTile,
							"location": clickedCellIndex,
						}),
					}).then(saveResponse => {
						if (saveResponse.ok) {
							return saveResponse.json();
						} else {
							throw new Error('Error in saving move to endpoint');
						}
					})
						.then(savedData => {
							console.log('Move saved:', savedData);
						})
						.catch(error => {
							console.error('Error:', error);
						});

				} catch (error) {
					console.error('Error executing move:', error.message);
				}
			}

			function handleResultValidation() {
				for (let i = 0; i <= 7; i++) {
					const winCondition = winningConditions[i];
					const a = gameState[winCondition[0]];
					const b = gameState[winCondition[1]];
					const c = gameState[winCondition[2]];
					if (a === '' || b === '' || c === '')
						continue;
					if (a === b && b === c) {
						roundWon = true;
						break;
					}
				}

				if (roundWon) {
					statusDisplay.innerHTML = winningMessage();
					clearInterval(intervalId);
					if (currentPlayer == playerTile) {
						playerScore++;
					}

					scoreText.innerHTML = score();
					return;
				}

				const roundDraw = !gameState.includes("");
				if (roundDraw) {
					clearInterval(intervalId);
					statusDisplay.innerHTML = drawMessage();

					return;
				}
			}
			function handleExitEvent() {
				roundWon = true;
				if (playerTile == 'X' || playerTile == 'O') {
					statusDisplay.innerHTML = "Other player left. You won.";
					clearInterval(intervalId);
					playerScore++;
					scoreText.innerHTML = score();
				}
				else {
					statusDisplay.innerHTML = "Other player left.";
					clearInterval(intervalId);
				}



			}

			document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));

		} else {
			statusDisplay.innerHTML = gameNotExisting();
		}
	});

});
