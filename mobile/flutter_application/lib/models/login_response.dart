class LoginResponse {
  String accesstoken;
  int expiresIn;

  LoginResponse({
    required this.accesstoken,
    required this.expiresIn
  });

  factory LoginResponse.fromJson(Map<String, dynamic> json){
    return LoginResponse(
      accesstoken: json['accesToken'], 
      expiresIn: json['expiresIn'],
    );
  }
}