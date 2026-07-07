import 'package:dio/dio.dart';
import 'package:flutter_application/services/auth_service.dart';

class DioClient {
  final Dio dio;
  final AuthService _authService;

  static const baseUrl = 'https://back-end-production-fa4d.up.railway.app';

  DioClient({required AuthService authService}) 
  : _authService = authService,
  dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: Duration(seconds: 10),
    receiveTimeout: Duration(seconds: 10),
    headers: {'Content-Type': 'application/json'}
    )) {
      _addInterceptor();
    }

  void _addInterceptor() {
    dio.interceptors.add(
      LogInterceptor(requestHeader: true, responseBody: true)
    );
    //Adicionado para debug em dev ^

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final isPublicRoute = options.path.contains('/auth/');
          
          if (!isPublicRoute) {
            final token = await _authService.getToken();
            if (token != null) {
              options.headers['Authorization'] = 'Bearer $token';
            }
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            await _authService.deleteToken();
          }
          handler.next(error);
        },
      ),
    );
  }

}