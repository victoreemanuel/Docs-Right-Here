import 'package:flutter/material.dart';

class PasswordField extends StatelessWidget {
  final TextEditingController controller;
  const PasswordField({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      validator: (value) {
        if (value == null || value.isEmpty)
          return 'Informe a senha';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        return null;
      },
      controller: controller,
      obscureText: true,
      keyboardType: TextInputType.visiblePassword,
      decoration: InputDecoration(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderSide: BorderSide.none,
        ),
        hintText: "Senha",
      ),
    );
  }
}