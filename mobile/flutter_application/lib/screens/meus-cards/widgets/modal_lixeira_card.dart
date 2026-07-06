import 'package:flutter/material.dart';
import 'package:flutter_application/repositories/card_repository.dart';

class ModalLixeiraCard extends StatefulWidget {
  final CardRepository repository;

  const ModalLixeiraCard({super.key, required this.repository});

  @override
  State<ModalLixeiraCard> createState() => _ModalLixeiraCardState();
}

class _ModalLixeiraCardState extends State<ModalLixeiraCard> {
  List<Map<String, dynamic>> _cardsExcluidos = [];
  bool _carregando = true;

  @override
  void initState() {
    super.initState();
    _buscarExcluidos();
  }

  Future<void> _buscarExcluidos() async {
    try {
      final dados = await widget.repository.getCardsExcluidos();
      if (!mounted) return;
      setState(() {
        _cardsExcluidos = dados;
        _carregando = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _carregando = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro ao carregar lixeira: $e')),
      );
    }
  }

  Color _converterStringParaCor(String? hexColor) {
    if (hexColor == null || hexColor.isEmpty) return const Color(0xFF495057);
    String limpa = hexColor.replaceAll('#', '');
    if (limpa.length != 6) return const Color(0xFF495057);
    return Color(int.parse('FF$limpa', radix: 16));
  }

  IconData _converterStringParaIcone(String? codePointStr) {
    if (codePointStr == null || codePointStr.isEmpty) return Icons.help_outline;
    int? codePoint = int.tryParse(codePointStr);
    if (codePoint == null) return Icons.help_outline;
    return IconData(codePoint, fontFamily: 'MaterialIcons');
  }

  Future<void> _restaurar(String id) async {
    final messenger = ScaffoldMessenger.of(context);
    try {
      await widget.repository.restaurarCard(id);
      if (!mounted) return;
      setState(() {
        _cardsExcluidos.removeWhere((c) => c['id'].toString() == id);
      });
      messenger.showSnackBar(const SnackBar(content: Text('Card restaurado com sucesso!')));
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text('Erro ao restaurar: $e')));
    }
  }

  Future<void> _deletarDefinitivo(String id) async {
    final messenger = ScaffoldMessenger.of(context);
    try {
      await widget.repository.deletarCardDefinitivo(id);
      if (!mounted) return;
      setState(() {
        _cardsExcluidos.removeWhere((c) => c['id'].toString() == id);
      });
      messenger.showSnackBar(const SnackBar(content: Text('Card deletado permanentemente!')));
    } catch (e) {
      messenger.showSnackBar(SnackBar(content: Text('Erro ao deletar: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF3A3F44),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.delete_sweep, color: Colors.white),
                SizedBox(width: 8),
                Text(
                  'Cards Excluídos',
                  style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
          
            if (_carregando)
              const Padding(
                padding: EdgeInsets.all(20.0),
                child: CircularProgressIndicator(color: Colors.white),
              )
            else if (_cardsExcluidos.isEmpty)
              const Padding(
                padding: EdgeInsets.all(20.0),
                child: Text(
                  'A lixeira está vazia.',
                  style: TextStyle(color: Colors.white60, fontStyle: FontStyle.italic),
                ),
              )
            else
              Container(
                constraints: const BoxConstraints(maxHeight: 300),
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: _cardsExcluidos.length,
                  itemBuilder: (context, index) {
                    final card = _cardsExcluidos[index];
                    final idStr = card['id'].toString();
                    final icone = _converterStringParaIcone(card['icone']);
                    final cor = _converterStringParaCor(card['cor']);

                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2C343E),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Icon(icone, color: cor, size: 24),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              card['titulo'] ?? 'Sem título',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.refresh, color: Colors.greenAccent, size: 20),
                            tooltip: 'Restaurar',
                            onPressed: () => _restaurar(idStr),
                          ),
                          // Botão de Apagar para Sempre
                          IconButton(
                            icon: const Icon(Icons.delete_forever, color: Colors.redAccent, size: 20),
                            tooltip: 'Excluir definitivamente',
                            onPressed: () => _deletarDefinitivo(idStr),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Fechar', style: TextStyle(color: Colors.white70)),
            ),
          ],
        ),
      ),
    );
  }
}