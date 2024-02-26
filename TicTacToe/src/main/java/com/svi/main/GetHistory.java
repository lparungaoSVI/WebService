package com.svi.main;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Path("listGames")
public class GetHistory {

    @GET
    @Path("/player/{key}")
    public Response getHistory(@PathParam("key") String key) {
        try {
            String path = "C:\\Users\\lpparungao\\Documents\\Projects\\Eclipse\\TicTacToe\\records\\player\\";
            String fileName = key + ".txt";
            File file = new File(path + fileName);
            BufferedReader br = new BufferedReader(new FileReader(file));
            List<String> gameUIDs = new ArrayList<>();
            String content;
            while ((content = br.readLine()) != null) {
                if (content.startsWith("Game UID:")) {
                    // Extracting the game UID and adding it to the list
                    gameUIDs.add(content.substring(10).trim());
                }
            }
            br.close();

            return Response
                    .status(Response.Status.OK)
                    .entity(gameUIDs)
                    .build();
        } catch (IOException e) {
            // Handle file IO exception
            return Response
                    .status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error reading file: " + e.getMessage())
                    .build();
        } catch (Exception e) {
            // Handle other unexpected exceptions
            return Response
                    .status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("The server ran into an unexpected exception: " + e.getMessage())
                    .build();
        }
    }
    
    @GET
    @Path("/game/{key}")
    public Response getGame(@PathParam("key") String key) {
        try {
            String path = "C:\\Users\\lpparungao\\Documents\\Projects\\Eclipse\\TicTacToe\\records\\game\\";
            String fileName = key + ".txt";
            File file = new File(path + fileName);
            BufferedReader br = new BufferedReader(new FileReader(file));
            List<String> gameData = new ArrayList<>();
            String content;
            while ((content = br.readLine()) != null) {
                
                    // Extracting the game UID and adding it to the list
            	gameData.add(content);
                
            }
            br.close();

            return Response
                    .status(Response.Status.OK)
                    .entity(gameData)
                    .build();
        } catch (IOException e) {
            // Handle file IO exception
            return Response
                    .status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error reading file: " + e.getMessage())
                    .build();
        } catch (Exception e) {
            // Handle other unexpected exceptions
            return Response
                    .status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("The server ran into an unexpected exception: " + e.getMessage())
                    .build();
        }
    }
}
