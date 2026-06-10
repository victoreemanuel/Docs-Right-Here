import 'package:dio/dio.dart';
import 'package:flutter_application/models/login_request.dart';
import 'package:flutter_application/models/login_response.dart';

class AuthRepository {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://192.168.100.109:8080',
    headers: {'Content-Type': 'application/json'},
  ));

  Future<LoginResponse> login(LoginRequest request) async{
    try {
      final response = await _dio.post(
        '/auth/login',
        data: request.toJson(),
      );
      return LoginResponse.fromJson(response.data);
    } on DioException catch(e) {
      final message = e.response?.data['message'];

      if (e.response?.statusCode == 401 || e.response?.statusCode == 404){
        throw Exception(message ?? 'Email ou senha incorretos');
      } else if (e.type == DioExceptionType.connectionTimeout || e.type == DioExceptionType.unknown){
        throw Exception('Não foi possível conectar ao servidor');
      }
      throw Exception('Erro ao fazer login');
    }
  }
}