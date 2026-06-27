import 'package:flutter/material.dart';

class CardDocumentoWidget extends StatelessWidget {
  final String alunoNome;
  final String remetente;
  final IconData icone;
  final Color iconeCor;
  final VoidCallback onAbrir;
  final VoidCallback onExcluir;

  const CardDocumentoWidget({
    super.key,
    required this.alunoNome,
    required this.remetente,
    required this.icone,
    required this.iconeCor,
    required this.onAbrir,
    required this.onExcluir,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF3A3F44),
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: iconeCor,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icone, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      alunoNome,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'por $remetente',
                      style: const TextStyle(color: Colors.white60, fontSize: 13),
                    ),
                  ],
                ),
              )
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton(
                style: TextButton.styleFrom(foregroundColor: Colors.redAccent),
                onPressed: onExcluir,
                child: const Text('Excluir'),
              ),
              const SizedBox(width: 8),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF495057),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: onAbrir,
                child: const Text('Abrir'),
              ),
            ],
          )
        ],
      ),
    );
  }
}