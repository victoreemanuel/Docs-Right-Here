import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  const CustomAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      leading: IconButton(
        icon: const Icon(Icons.menu, color: Colors.white, size: 28),
        onPressed: () {
          Scaffold.of(context).openDrawer();
        },
      ),
      title: const Text(
        'Meus Cards',
        style: TextStyle(
          color: Colors.white, 
          fontWeight: FontWeight.w500, 
          fontSize: 24,
        ),
      ),
      centerTitle: false,
      elevation: 0,
      flexibleSpace: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
            colors: [
              Color.fromARGB(255, 56, 135, 205), 
              Color.fromARGB(255, 48, 217, 133) 
            ],
          ),
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_none, color: Colors.white, size: 24),
          onPressed: () {},
        ),
        IconButton(
          icon: const Icon(Icons.calendar_month_outlined, color: Colors.white, size: 24),
          onPressed: () {},
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 8.0),
          child: CircleAvatar(
            radius: 18,
            backgroundColor: Colors.white24,
            backgroundImage: NetworkImage('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
          ),
        ),
        IconButton(
          icon: const Icon(Icons.logout, color: Colors.redAccent, size: 24),
          onPressed: () {},
        ),
        const SizedBox(width: 8),
      ],
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}