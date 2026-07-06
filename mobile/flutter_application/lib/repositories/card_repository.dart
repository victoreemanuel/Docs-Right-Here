import 'package:dio/dio.dart';
import 'package:flutter_application/services/dio_client.dart';

class CardRepository {
  final DioClient _dioClient;

  CardRepository({required DioClient dioClient}) : _dioClient = dioClient;

  Future<List<Map<String, dynamic>>> getCards() async {
    try {
      final response = await _dioClient.dio.get('/cards');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;

        return data.map((item) => item as Map<String, dynamic>).toList();
      } else {
        throw Exception('Falha ao carregar ');
      }
    } catch (e) {
      throw Exception('Falha na conexão com o Back-End');
    }
  }

  Future<Map<String, dynamic>> criarCard(Map<String, dynamic> cardDados) async {
    try {
      final cardResponse = await _dioClient.dio.post('/cards', data: cardDados);

      if (cardResponse.statusCode == 200 || cardResponse.statusCode == 201) {
        return cardResponse.data as Map<String, dynamic>;
      } else {
        throw Exception('Falha ao criar o card no servidor');
      }
    } catch (e) {
      throw Exception('Falha na conexão com o Back-End ao criar card: $e');
    }
  }

  Future<void> lixeiraCard(String id) async {
    try {

      final cardResponse = await _dioClient.dio.put('/cards/$id/lixeira');

      if (cardResponse.statusCode != 200) {
        throw Exception('Falha ao enviar o card para a lixeira no servidor');
      }
    } catch (e) {
      throw Exception('Falha na conexão com o Back-End ao Excluir o card: $e');
    }
  }

  Future<List<Map<String, dynamic>>> getCardsExcluidos() async {
    try {
      final response = await _dioClient.dio.get('/cards/excluidos');

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;

        return data.map((item) => item as Map<String, dynamic>).toList();
      } else {
        throw Exception('Falha ao carregar ');
      }
    } catch (e) {
      throw Exception('Falha na conexão com o Back-End');
    }
  }

  Future<void> restaurarCard(String id) async {
    try {
      final cardResponse = await _dioClient.dio.put('/cards/$id/restaurar');

      if (cardResponse.statusCode != 200) {
        
        throw Exception('Falha ao restaurar o card no servidor');
      }
    } catch (e) {

      throw Exception('Falha na conexão com o Back-End ao restaurar o card: $e');

    }
  }

  Future<void> deletarCardDefinitivo(String id) async {
    try {
      final cardResponse = await _dioClient.dio.delete('/cards/$id');

      if (cardResponse.statusCode != 200 && cardResponse.statusCode != 204) {
        
        throw Exception('Falha ao deletar o card definitivamente no servidor');
      }
    } catch (e) {

      throw Exception('Falha na conexão com o Back-End ao deletar o card: $e');

    }
  }

  Future<Map<String, dynamic>> uploadArquivo(String cardId, String caminhoLocal, String nomeArquivo) async {
    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(caminhoLocal, filename: nomeArquivo),
      });

      final response = await _dioClient.dio.post(
        '/cards/$cardId/arquivos',
        data: formData,
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return response.data as Map<String, dynamic>;
      } else {
        throw Exception('Falha ao enviar arquivo para o servidor');
      }
    } catch (e) {
      throw Exception('Erro no upload do arquivo: $e');
    }
  }

}
