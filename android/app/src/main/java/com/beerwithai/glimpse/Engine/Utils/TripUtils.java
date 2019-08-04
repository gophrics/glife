package com.beerwithai.glimpse.Engine.Utils;


import com.beerwithai.glimpse.Engine.Modals.Constants;
import com.beerwithai.glimpse.Engine.Modals.Region;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;

import javax.net.ssl.HttpsURLConnection;

public class TripUtils {

    public static String ServerURLWithoutEndingSlash = Constants.ServerURL;

    public static String GenerateTripId() {
        return String.valueOf(Math.random()*100000);
    }

    public static Integer getWeatherFromCoordinates(Float latitude, Float longitude) throws Exception {
        String urlString = TripUtils.ServerURLWithoutEndingSlash + "/api/v1/travel/searchweatherbylocation";
        String postParameters= "latitude=" + String.valueOf(latitude) + "&longitude=" + String.valueOf(longitude);

        try {
            String response = TripUtils.sendPost(urlString, postParameters);
            JSONObject responseJSON = new JSONObject(response);
            Integer result = Integer.valueOf(responseJSON.getJSONObject("main").getInt("temp"));
            return result;
        } catch (Exception e) {
            throw e; // TODO: Change exception to be generic
        }
    }

    public static String getCountryCodeFromCoordinates(Float latitude, Float longitude) throws Exception {
        String urlString = TripUtils.ServerURLWithoutEndingSlash + "/api/v1/travel/searchcoordinates";
        String postParameters = "latitude=" + String.valueOf(latitude) + "&longitude=" + String.valueOf(longitude);

        try {
            String response = TripUtils.sendPost(urlString, postParameters);
            JSONObject responseJSON = new JSONObject(response);
            String result = responseJSON.getJSONObject("address").getString("countryCode");
            return result;
        } catch (Exception e) {
            throw e; // TODO: Change exception to be generic
        }
    }

    public static String getLocationFromCoordinates(Float latitude, Float longitude) throws Exception {
        String urlString = TripUtils.ServerURLWithoutEndingSlash + "/api/v1/travel/searchcoordinates";
        String postParmeters = "latitude=" + String.valueOf(latitude) + "&longitude=" + String.valueOf(longitude);

        try {
            String response = TripUtils.sendPost(urlString, postParmeters);
            JSONObject responseJSON = new JSONObject(response);
            String result = responseJSON.getJSONObject("address").getString("state");
            if(result == null) //TODO: Check if it's null
            {
                result = responseJSON.getJSONObject("address").getString("county");
            }
            return result;
        } catch (Exception e) {
            throw e;
        }
    }

    public static ArrayList<Region> getCoordinatesFromLocation(String location) throws Exception {
        String urlString = TripUtils.ServerURLWithoutEndingSlash + "/api/v1/travel/searchlocation";
        String postParameters = "location=" + location;

        try {
            String response = TripUtils.sendPost(urlString, postParameters);
            JSONArray responseJSON = new JSONArray(response);
            ArrayList<Region> result = new ArrayList<Region>();
            for(int i = 0; i < responseJSON.length(); i++) {
                JSONObject obj = responseJSON.getJSONObject(i);
                Region _result = new Region();
                _result.name = obj.getString("display_name");
                _result.latitude = Float.valueOf(obj.getString("lat"));
                _result.longitude = Float.valueOf(obj.getString("lon"));
                result.add(_result);
            }
            return result;
        } catch ( Exception e) {
            throw e;
        }
    }





    private static String sendPost(String url, String data) throws Exception {

        URL obj = new URL(url);
        HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

        //add reuqest header
        con.setRequestMethod("POST");
        String urlParameters = data;

        // Send post request
        con.setDoOutput(true);
        DataOutputStream wr = new DataOutputStream(con.getOutputStream());
        wr.writeBytes(urlParameters);
        wr.flush();
        wr.close();

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'POST' request to URL : " + url);
        System.out.println("Post parameters : " + urlParameters);
        System.out.println("Response Code : " + responseCode);

        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();

        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        //print result
        System.out.println(response.toString());
        return response.toString();
    }

}
