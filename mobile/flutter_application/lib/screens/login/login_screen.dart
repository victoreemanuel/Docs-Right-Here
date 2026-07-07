import 'package:flutter/material.dart';
import 'package:flutter_application/models/login_request.dart';
import 'package:flutter_application/repositories/auth_repository.dart';
import 'package:flutter_application/screens/login/widgets/email_field.dart';
import 'package:flutter_application/screens/login/widgets/login_header.dart';
import 'package:flutter_application/screens/login/widgets/password_field.dart';
import 'package:flutter_application/screens/meus-cards/meus_cards.dart';
import 'package:flutter_application/services/auth_service.dart';
import 'package:flutter_application/services/dio_client.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;
  final _formKey = GlobalKey<FormState>();

  late final AuthService _authService;
  late final AuthRepository _authRepository;

  void _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final request = LoginRequest(
        email: _emailController.text,
        password: _passwordController.text,
      );

      final response = await _authRepository.login(request);
      await _authService.saveToken(response.accesstoken);

      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => MeusCardsPage()),
        );
      }
      //
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    final authService = AuthService();
    final dioClient = DioClient(authService: authService);
    _authRepository = AuthRepository(dioClient: dioClient);
    _authService = authService;
  }

  @override
  void dispose() {
    super.dispose();
    _emailController.dispose();
    _passwordController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color.fromARGB(255, 0, 219, 139),
              Color.fromARGB(255, 0, 141, 171),
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: EdgeInsets.all(24),
              child: Container(
                padding: EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Color.fromARGB(255, 36, 42, 50),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Form(
                  key: _formKey,
                  child: Column(
                    spacing: 10,
                    children: [
                      LoginHeader(),
                      EmailField(controller: _emailController),
                      PasswordField(controller: _passwordController),
                      if (_errorMessage != null)
                        Text(
                          _errorMessage!,
                          style: TextStyle(color: Colors.red),
                          textAlign: TextAlign.center,
                        ),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: Color.fromARGB(255, 0, 141, 171),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadiusGeometry.circular(4),
                            ),
                          ),
                          child: _isLoading
                              ? SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Color.fromARGB(255, 0, 141, 171),
                                  ),
                                )
                              : Text("Entrar"),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
