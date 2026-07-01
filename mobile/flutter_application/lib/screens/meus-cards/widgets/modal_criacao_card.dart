import 'package:flutter/material.dart';

class ModalCriacaoCard extends StatefulWidget {
  // CORREÇÃO: Definida a assinatura estrita do callback exigida pelo Dart moderno
  final void Function(String titulo, String descricao, IconData icone, Color cor) onCardCriado;

  const ModalCriacaoCard({super.key, required this.onCardCriado});

  @override
  State<ModalCriacaoCard> createState() => _ModalCriacaoCardState();
}

class _ModalCriacaoCardState extends State<ModalCriacaoCard> {
  final TextEditingController _tituloController = TextEditingController();
  final TextEditingController _descController = TextEditingController();

  IconData _iconeSelecionado = Icons.school;
  Color _corSelecionada = Colors.red;

  final List<IconData> _icones = [
    Icons.school, Icons.book, Icons.calendar_month, Icons.email, Icons.camera_alt,
    Icons.visibility, Icons.description, Icons.image, Icons.groups, Icons.group
  ];

  final List<Color> _cores = [
    Colors.red, Colors.orange, Colors.green, Colors.cyan, Colors.purple
  ];

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF3A3F44),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.create_new_folder_outlined, color: Colors.white),
                SizedBox(width: 10),
                Text('Novo Card', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 15),
            const Text('Título:', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            const SizedBox(height: 5),
            TextField(
              controller: _tituloController,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                filled: true, 
                fillColor: const Color(0xFF2C343E),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
                contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8)
              ),
            ),
            const SizedBox(height: 15),
            const Text('Descrição:', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            const SizedBox(height: 5),
            TextField(
              controller: _descController,
              maxLines: 2,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                filled: true, 
                fillColor: const Color(0xFF2C343E),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 15),
            const Text('Ícones:', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 5, 
                mainAxisSpacing: 8, 
                crossAxisSpacing: 8,
              ),
              itemCount: _icones.length,
              itemBuilder: (context, index) {
                bool isSel = _iconeSelecionado == _icones[index];
                return GestureDetector(
                  onTap: () => setState(() => _iconeSelecionado = _icones[index]),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isSel ? Colors.white24 : Colors.transparent, 
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(_icones[index], color: Colors.white, size: 24),
                  ),
                );
              },
            ),
            const SizedBox(height: 15),
            const Text('Cor:', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: _cores.map((cor) {
                bool isSel = _corSelecionada == cor;
                return GestureDetector(
                  onTap: () => setState(() => _corSelecionada = cor),
                  child: Container(
                    width: 30, 
                    height: 30,
                    decoration: BoxDecoration(
                      color: cor, 
                      shape: BoxShape.circle, 
                      border: isSel ? Border.all(color: Colors.white, width: 2) : null,
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 25),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  style: TextButton.styleFrom(foregroundColor: Colors.white70),
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancelar'),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF495057),
                    foregroundColor: Colors.white,
                  ),
                  onPressed: () {
                    if (_tituloController.text.isNotEmpty) {
                      widget.onCardCriado(
                        _tituloController.text, 
                        _descController.text, 
                        _iconeSelecionado, 
                        _corSelecionada
                      );
                      Navigator.pop(context);
                    }
                  },
                  child: const Text('Criar'),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}