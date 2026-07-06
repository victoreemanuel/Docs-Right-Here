import 'package:flutter/material.dart';
import 'package:scanbot_sdk/scanbot_sdk.dart';
import 'package:file_picker/file_picker.dart';
import 'package:open_filex/open_filex.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:flutter_application/repositories/card_repository.dart';

class ModalDetalhesCard extends StatefulWidget {
final String cardId;              
  final CardRepository repository;
  final String alunoNome;
  final IconData icone;
  final Color iconeCor;
  final List<dynamic> arquivosIniciais;
  final VoidCallback onExcluirCardCompleto;

  const ModalDetalhesCard({
    super.key, 
    required this.cardId, 
    required this.repository, 
    required this.alunoNome, 
    required this.icone,
    required this.iconeCor, 
    required this.arquivosIniciais,
    required this.onExcluirCardCompleto,
  });

  @override
  State<ModalDetalhesCard> createState() => _ModalDetalhesCardState();
}

class _ModalDetalhesCardState extends State<ModalDetalhesCard> {
  final List<Map<String, String>> _arquivos = [];

  @override
  void initState() {
    super.initState();
    for (var arq in widget.arquivosIniciais) {
      _arquivos.add({
        'nome': arq['nome']?.toString() ?? 'Sem nome',
        'caminho': arq['url']?.toString() ?? '', // No banco guardamos como URL do MinIO
      });
    }
  }


  void _msg(String txt) => ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(txt)));

  void _abrirArquivo(String path) async {
    if (path.isEmpty) return _msg('Caminho não disponível.');
    var res = await OpenFilex.open(path);
    if (res.type != ResultType.done) _msg('Não foi possível abrir: ${res.message}');
  }

  void _anexarArquivoLocal() async {
    try {
      FilePickerResult? res = await FilePicker.pickFiles(type: FileType.any, allowMultiple: false);

      if (res != null && res.files.isNotEmpty) {
        var arq = res.files.first;
        String nome = arq.name;
        String caminho = arq.path ?? "";

        _msg('Fazendo upload de $nome...');

        await widget.repository.uploadArquivo(widget.cardId, caminho, nome);

        setState(() => _arquivos.add({'nome': nome, 'caminho': caminho}));
        _msg('$nome salvo no servidor com sucesso!');
      }
    } catch (e) { 
      _msg('Erro ao salvar arquivo no servidor: $e'); 
    }
  }

  void _dispararScanner() async {
    var status = await Permission.camera.request();

    if (!mounted) return;

    if (status.isPermanentlyDenied) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text('Câmera'),
          content: const Text('Habilite a permissão nas configurações do app.'),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Sair')),
            TextButton(onPressed: () { openAppSettings(); Navigator.pop(ctx); }, child: const Text('Configurações')),
          ],
        ),
      );
      return;
    }
    if (!status.isGranted) return _msg('Permissão negada.');

    try {
      var scanRes = await ScanbotSdk.document.startScanner(DocumentScanningFlow());
      if (scanRes is Ok<DocumentData>) {
        var pdfRes = await ScanbotSdk.pdfGenerator.generateFromDocument(
          scanRes.value.uuid, 
          PdfConfiguration(pageSize: PageSize.A4, pageDirection: PageDirection.PORTRAIT)
        );
        
        if (pdfRes is Ok<String>) {
          String path = pdfRes.value.replaceFirst('file://', '');
          String nome = path.split('/').last;

          _msg('Salvando documento escaneado...');
          
          await widget.repository.uploadArquivo(widget.cardId, path, nome);

          setState(() => _arquivos.add({'nome': nome, 'caminho': path}));
          _msg('Documento digitalizado e salvo no servidor!');
        }
      }
    } catch (e) { _msg('Erro ao escanear e salvar: $e'); }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: const Color(0xFF3A3F44),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 24),
      child: Padding(
        padding: const EdgeInsets.all(14.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(children: [
              Container(padding: const EdgeInsets.all(8), decoration: BoxDecoration(color: widget.iconeCor, borderRadius: BorderRadius.circular(8)), child: Icon(widget.icone, color: Colors.white, size: 22)),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(widget.alunoNome, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14), maxLines: 1, overflow: TextOverflow.ellipsis),
                const Text('por Paula Schmitt', style: TextStyle(color: Colors.white60, fontSize: 11)),
              ]))
            ]),
            const SizedBox(height: 15),
            Row(children: [
              Expanded(child: SizedBox(height: 38, child: TextField(style: const TextStyle(color: Colors.white, fontSize: 13), decoration: InputDecoration(hintText: 'Buscar...', hintStyle: const TextStyle(color: Colors.white30), prefixIcon: const Icon(Icons.search, color: Colors.white, size: 18), filled: true, fillColor: Colors.white12, contentPadding: EdgeInsets.zero, border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: BorderSide.none))))),
              const SizedBox(width: 8),
              SizedBox(height: 38, child: OutlinedButton.icon(style: OutlinedButton.styleFrom(foregroundColor: Colors.white, side: const BorderSide(color: Colors.white30), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))), icon: const Icon(Icons.filter_alt_outlined, size: 16), label: const Text('Filtros', style: TextStyle(fontSize: 12)), onPressed: () {}))
            ]),
            const SizedBox(height: 15),
            Container(
              constraints: const BoxConstraints(maxHeight: 220),
              child: _arquivos.isEmpty
                  ? const Padding(padding: EdgeInsets.symmetric(vertical: 30), child: Text('Nenhum documento anexado ainda.', style: TextStyle(color: Colors.white38, fontSize: 13, fontStyle: FontStyle.italic)))
                  : ListView.builder(
                      shrinkWrap: true,
                      itemCount: _arquivos.length,
                      itemBuilder: (context, idx) {
                        final arq = _arquivos[idx];
                        return GestureDetector(
                          onTap: () => _abrirArquivo(arq['caminho'] ?? ''),
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                            decoration: BoxDecoration(color: const Color(0xFF2C343E), borderRadius: BorderRadius.circular(8)),
                            child: Row(children: [
                              const Icon(Icons.insert_drive_file, color: Colors.amber, size: 22),
                              const SizedBox(width: 10),
                              Expanded(child: Text(arq['nome']!, style: const TextStyle(color: Colors.white, fontSize: 13), overflow: TextOverflow.ellipsis)),
                              const Icon(Icons.open_in_new, color: Colors.white38, size: 16),
                            ]),
                          ),
                        );
                      },
                    ),
            ),
            const SizedBox(height: 20),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(children: [
                _btn('Anexar', Icons.attach_file, _anexarArquivoLocal), const SizedBox(width: 6),
                _btn('Scanner', Icons.document_scanner, _dispararScanner), const SizedBox(width: 6),
                _btn('Excluir', Icons.delete_outline, widget.onExcluirCardCompleto), const SizedBox(width: 6),
                _btn('Fechar', Icons.close, () => Navigator.pop(context)),
              ]),
            )
          ],
        ),
      ),
    );
  }

  Widget _btn(String label, IconData icon, VoidCallback onTap) {
    return ElevatedButton.icon(
      style: ElevatedButton.styleFrom(backgroundColor: Colors.white24, foregroundColor: Colors.white, elevation: 0, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
      icon: Icon(icon, size: 14), label: Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w400)), onPressed: onTap,
    );
  }
}