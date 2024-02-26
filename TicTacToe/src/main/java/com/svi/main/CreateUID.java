package com.svi.main;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import com.svi.model.CreateUIDRequest;
import com.svi.response.CreateUIDResponse;

@Path("createUID")
public class CreateUID {

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public CreateUIDResponse createUID(CreateUIDRequest data) throws IOException {
		try {

			String gameUID = data.getGameUID();
			String gameCode = data.getGameKey();

			String path = "C:\\Users\\lpparungao\\Documents\\Projects\\Eclipse\\TicTacToe\\records\\openRooms\\";
			new File(path).mkdirs();

			String fileName = gameCode + ".txt";
			File file = new File(path + fileName);

			try {
				file.createNewFile();

				// Open file in append mode
				FileWriter fw = new FileWriter(file, true);
				BufferedWriter bw = new BufferedWriter(fw);
				PrintWriter out = new PrintWriter(bw);

				// Write data to the file
				out.println(gameUID);
				out.close();

			} catch (IOException e) {
				e.printStackTrace();
			}

			return new CreateUIDResponse(gameUID);
		} catch (Exception e) {
			throw new WebApplicationException("The server ran into an unexpected exception.", 500);
		}
	}
}