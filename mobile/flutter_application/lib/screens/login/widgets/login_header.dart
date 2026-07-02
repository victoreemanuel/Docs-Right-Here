import 'package:flutter/material.dart';

class LoginHeader extends StatelessWidget {
  const LoginHeader({super.key});

  @override

  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(Icons.school, size: 140, color: Colors.white),
        Text(
          "Bem vindo de volta!",
          style: TextStyle(
            fontSize: 25,
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}