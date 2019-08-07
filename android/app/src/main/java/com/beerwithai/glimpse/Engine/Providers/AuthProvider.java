package com.beerwithai.glimpse.Engine.Providers;


class RegisterUserModal {
    String Phone = "";
    String Email = "";
    String Password =  "";
}

class LoginUserModal {
    String Email = "";
    String Password = "";
}

public class AuthProvider {

    public static String AuthToken = "";

    public static void SetAuthToken(String token) {

    }
}
