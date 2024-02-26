package com.svi.main;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import com.svi.model.SaveRequest;
import com.svi.response.SaveResponse;

@Path("save")
public class Save {
	// CREATE RECORDS FOLDER -> GAME && PLAYER
	private static final String GAME_DIRECTORY = "C:\\Users\\lpparungao\\Documents\\Projects\\Eclipse\\TicTacToe\\records\\game\\";
	private static final String PLAYER_DIRECTORY = "C:\\Users\\lpparungao\\Documents\\Projects\\Eclipse\\TicTacToe\\records\\player\\";

	@POST
	@Path("/game")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public SaveResponse saveMove(SaveRequest data) throws IOException {
		try {

			String gameUID = data.getGameUID();
			String gameCode = data.getGameKey();
			String playerUID = data.getPlayerID();
			String symbol = data.getSymbol();
			String location = data.getLocation();
			String date = getCurrentDateTime();

			// Concatenate all strings into the 'line' variable with adjusted titles
			String line = "Room Code: " + gameCode + ", Game UID: " + gameUID + ", Player UID: " + playerUID
					+ ", Symbol: " + symbol + ", Location: " + location + ", Date: " + date;

			// Create the directory if it doesn't exist
			File directory = new File(GAME_DIRECTORY);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			// Generate a unique filename
			String filename = gameUID + ".txt";

			// Write the line to the file
			try (BufferedWriter writer = new BufferedWriter(new FileWriter(GAME_DIRECTORY + filename, true))) {
				writer.write(line);
				writer.newLine();
			} catch (IOException e) {
				throw new WebApplicationException("Failed to write to file.", 500);
			}

			return new SaveResponse(line);
		} catch (Exception e) {
			throw new WebApplicationException("The server ran into an unexpected exception.", 500);
		}
	}
	
	@POST
	@Path("/player")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public SaveResponse savePlayer(SaveRequest data) throws IOException {
		try {

			String gameUID = data.getGameUID();
			String playerUID = data.getPlayerID();

			// Concatenate all strings into the 'line' variable with adjusted titles
			String line = "Game UID: " + gameUID;

			// Create the directory if it doesn't exist
			File directory = new File(PLAYER_DIRECTORY);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			// Generate a unique filename
			String filename = playerUID + ".txt";

			// Write the line to the file
			try (BufferedWriter writer = new BufferedWriter(new FileWriter(PLAYER_DIRECTORY + filename, true))) {
				writer.write(line);
				writer.newLine();
			} catch (IOException e) {
				throw new WebApplicationException("Failed to write to file.", 500);
			}

			return new SaveResponse(line);
		} catch (Exception e) {
			throw new WebApplicationException("The server ran into an unexpected exception.", 500);
		}
	}

	private String getCurrentDateTime() {
		LocalDateTime dateTime = LocalDateTime.now();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		return dateTime.format(formatter);
	}
}