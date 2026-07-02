

import 'package:flutter_application/services/dio_client.dart';

class CardRepository {

  final DioClient _dioClient;

  CardRepository({required DioClient dioClient}) : _dioClient = dioClient;

  Future<List<Map<String, dynamic>>> getCards() async{

    try{

      final response = await _dioClient.dio.get('/cards');

      if(response.statusCode == 200){

        final List<dynamic> data = response.data;
        
        return data.map((item) => item as Map<String, dynamic>).toList();

      } else{
        throw Exception('Falha ao carregar ');
      }
    }catch (e) {
      throw Exception('Falha na conexão com o Back-End');
    }
  }
}