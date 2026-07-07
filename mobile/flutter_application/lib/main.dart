import 'package:flutter/material.dart';
import 'package:flutter_application/screens/login/login_screen.dart';
import 'package:scanbot_sdk/scanbot_sdk.dart'; // Importação oficial v8

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {

    var config = SdkConfiguration(
      licenseKey: "", 
      loggingEnabled: true,
    );
    
    await ScanbotSdk.initialize(config);
  } catch (e) {
    debugPrint("Aviso: Falha ao carregar motor do Scanbot nativo: $e");
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'DocsRightHere', 
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const LoginScreen(), 
    );
  }
}