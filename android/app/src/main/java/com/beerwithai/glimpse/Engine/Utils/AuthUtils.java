package com.beerwithai.glimpse.Engine.Utils;

import com.beerwithai.glimpse.Engine.Modals.Constants;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

public class AuthUtils {

    public static String ServerURLWithoutEndingSlash = Constants.ServerURL;

    public static String Login(String Email, String Password) throws Exception {
        String urlString = AuthUtils.ServerURLWithoutEndingSlash + "/api/v1/profile/login";
        String postParmeters = "email=" + Email + "&password=" + Password;

        try {
            String response = AuthUtils.sendPost(urlString, postParmeters);
            JSONObject responseJSON = new JSONObject(response);
            String result = responseJSON.getString("Token");
            return result;
        } catch (Exception e) {
            throw e;
        }
    }

    public static String Register(String Email, String Phone, String Password) throws Exception {
        String urlString = AuthUtils.ServerURLWithoutEndingSlash + "/api/v1/profile/register";
        String postParmeters = "email=" + Email + "&password=" + Password;

        try {
            String response = AuthUtils.sendPost(urlString, postParmeters);
            JSONObject responseJSON = new JSONObject(response);
            String result = responseJSON.getString("Token");
            return result;
        } catch (Exception e) {
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
