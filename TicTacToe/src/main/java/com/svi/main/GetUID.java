package com.svi.main;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@Path("getUID/{key}")
public class GetUID {

	@GET
	public Response createUID(@PathParam("key") String key) throws IOException {
		try {
			String path = "C:\\Users\\lpparungao\\Documents\\Projects\\Eclipse\\TicTacToe\\records\\openRooms\\";
			String fileName = key + ".txt";
			File file = new File(path + fileName);
			BufferedReader br = new BufferedReader(new FileReader(file));
			String fileContent = "";
			String content;
			while ((content = br.readLine()) != null) {
				fileContent += content;
			}
			br.close();
			file.delete();

			return Response
	                  .status(Response.Status.OK)
	                  .entity(fileContent.replace('"', ' ').trim())
	                  .build();
		} catch (Exception e) {
			throw new WebApplicationException("The server ran into an unexpected exception.", 500);
		}
	}
}