import 'package:flutter/material.dart';
import 'package:flutter_application/services/dio_client.dart';
import 'package:flutter_application/services/auth_service.dart';
import 'package:flutter_application/repositories/card_repository.dart';
import 'widgets/custom_app_bar.dart';
import 'widgets/custom_sidebar.dart';
import 'widgets/card_documento_widget.dart';
import 'widgets/modal_criacao_card.dart';
import 'widgets/modal_detalhes_card.dart';

class MeusCardsPage extends StatefulWidget {
  const MeusCardsPage({super.key});

  @override
  State<MeusCardsPage> createState() => _MeusCardsPageState();
}

class _MeusCardsPageState extends State<MeusCardsPage> {
   List<dynamic> _meusCards = [];

  late CardRepository cardRepository;

  @override
  initState(){
    super.initState();

    cardRepository = CardRepository(
    dioClient: DioClient(authService: AuthService()),
    );

    carregarCards();
  }

  void carregarCards() async {
    try{
    final response = await cardRepository.getCards();

     setState(() {
       _meusCards = response.map((card) {
       return {
        'id': card['id'].toString(),
        'titulo': card['titulo'] ?? 'Sem titulo',
        'remetente': card['Paula Schimitt'] ?? '',
        'icone': _converterStringParaIcone(card['icone']),
        'iconeCor': _converterStringParaCor(card['cor']),
       };
       }).toList();

     });
    } catch (e){
      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erro ao carregar os cards: $e')),
      );
    }

  }

  void _abrirModalCriacao() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (BuildContext context) {
        return ModalCriacaoCard(
            onCardCriado: (titulo, descricao, icone, cor) async{

              final messenger = ScaffoldMessenger.of(context);

              try{
                final Map<String,dynamic> novoCardDados = {
                  'alunoNome': titulo,
                  'descricao': descricao,
                  'icone': icone.codePoint.toString(),
                  'iconeCor': '#${cor.toARGB32().toRadixString(16).substring(2)}',
                };

                   final cardSalvoNoBanco = await cardRepository.criarCard(novoCardDados);   

                   setState(() {
                     _meusCards.insert(0, {

                      'id': cardSalvoNoBanco['id'].toString(),
                      'titulo': cardSalvoNoBanco['titulo'],
                      'remetente': 'Paula Schmitt',
                      'descricao': cardSalvoNoBanco['descricao'],
                      'icone': icone, 
                      'iconeCor': cor,

                     });
                   });

                }catch (e){

               if (!mounted) return; 

              messenger.showSnackBar(
                SnackBar(content: Text('Erro ao salvar o card no banco: $e')),
              ); 
              }
            }
        );
      },
    );
  }

  void _abrirModalDetalhes(Map<String, dynamic> card) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (BuildContext context) {
        return ModalDetalhesCard(
          alunoNome: card['alunoNome'],
          icone: card['icone'],
          iconeCor: card['iconeCor'],
          onExcluirCardCompleto: () {
            setState(() {
              _meusCards.removeWhere((c) => c['id'] == card['id']);
            });
            Navigator.pop(context);
          },
        );
      },
    );
  }

  void _abrirModalLixeira() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: const Color(0xFF3A3F44),
          title: const Text('Lixeira', style: TextStyle(color: Colors.white)),
          content: const Text(
            'Conexão com o botão feita com sucesso! Próximo passo: carregar a lista aqui.',
            style: TextStyle(color: Colors.white70),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Fechar', style: TextStyle(color: Colors.white)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: const CustomAppBar(),
      drawer: const CustomSidebar(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                _buildTopBadge('Paula Schmitt', const Color(0xFF00C4CC), hasImage: true),
                const SizedBox(width: 8),
                _buildTopBadge('Professor(a)', const Color(0xFF17A2B8), hasImage: false),
              ],
            ),
            const SizedBox(height: 15),
            Align(
              alignment: Alignment.centerRight,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF495057),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                icon: const Icon(Icons.delete_outline, size: 18),
                label: const Text('Cards Excluidos'),
                onPressed: _abrirModalLixeira, 
              ),
            ),
            const SizedBox(height: 15),
            Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    onTap: _abrirModalCriacao,
                    child: Container(
                      height: 105,
                      decoration: BoxDecoration(
                        color: const Color(0xFF495057), 
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: const Icon(Icons.add, color: Colors.white, size: 45),
                    ),
                  ),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Container(
                    height: 105,
                    decoration: BoxDecoration(
                      color: const Color(0xFF495057), 
                      borderRadius: BorderRadius.circular(15),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      'Acessar todos\nCards (${_meusCards.length})',
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 25),
            if (_meusCards.isNotEmpty) ...[
              const Text(
                'Meus Cards', 
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF2C343E)),
              ),
              const SizedBox(height: 15),
              Column(
                children: _meusCards.map((card) {
                  return CardDocumentoWidget(
                    alunoNome: card['titulo'] ?? card['titulo'] ?? 'Sem nome',
                    remetente: card['remetente'],
                    icone: card['icone'],
                    iconeCor: card['iconeCor'],
                    onAbrir: () => _abrirModalDetalhes(card),
                    onExcluir: () async {
                      final messenger = ScaffoldMessenger.of(context);
                      try{
                        await cardRepository.lixeiraCard(card['id'].toString());
                      setState(() {
                        _meusCards.removeWhere((c) => c['id'] == card['id']);
                      });
                      } catch (e){
                        messenger.showSnackBar(SnackBar(content: Text('Não foi possivel enviar para a lixeira: $e')),);
                      }

                    },
                  );
                }).toList(),
              ),
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildTopBadge(String text, Color color, {required bool hasImage}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(5)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (hasImage) ...[
            const CircleAvatar(
              radius: 8, 
              backgroundImage: NetworkImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50'),
            ),
            const SizedBox(width: 6),
          ],
          Text(text, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  Color _converterStringParaCor(String? hexColor){
    if(hexColor == null || hexColor.isEmpty) return const Color(0xFF495057);
    String limpa = hexColor.replaceAll('#', '');
    if(limpa.length != 6) return Color(0xFF495057);
    return Color(int.parse('FF$limpa', radix: 16));
  }

  IconData _converterStringParaIcone(String? codePointStr) {
    if (codePointStr == null || codePointStr.isEmpty) return Icons.help_outline;
    int? codePoint = int.tryParse(codePointStr);
    if (codePoint == null) return Icons.help_outline;
    return IconData(codePoint, fontFamily: 'MaterialIcons');
  }

}