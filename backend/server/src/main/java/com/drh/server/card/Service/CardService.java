package com.drh.server.card.Service;

import com.drh.server.card.dto.CardDTO;
import com.drh.server.card.model.Card;
import com.drh.server.card.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CardService {

    @Autowired
    private CardRepository repository;

    public List<CardDTO> findAll() {
        List<Card> list = repository.findAll();
        return list.stream()
                .filter(x -> !x.isExcluido())
                .map(x -> new CardDTO(x))
                .collect(Collectors.toList());
    }

    public List<CardDTO> findExcluidos() {
        List<Card> list = repository.findAll();
        return list.stream()
                .filter(x -> x.isExcluido())
                .map(x -> new CardDTO(x))
                .collect(Collectors.toList());
    }

    public CardDTO findById(Long id) {
        Card entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card não encontrado. ID: " + id));
        return new CardDTO(entity);
    }

    public CardDTO insert(CardDTO dto) {
        Card entity = new Card();
        copyDtoToEntity(dto, entity);
        entity.setExcluido(false);
        entity = repository.save(entity);
        return new CardDTO(entity);
    }

    public CardDTO update(Long id, CardDTO dto) {
        Card entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card não encontrado. ID: " + id));
        copyDtoToEntity(dto, entity);
        entity = repository.save(entity);
        return new CardDTO(entity);
    }

    public void moverParaLixeira(Long id) {
        Card entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card não encontrado. ID: " + id));
        entity.setExcluido(true);
        repository.save(entity);
    }

    public void restaurar(Long id) {
        Card entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card não encontrado. ID: " + id));
        entity.setExcluido(false);
        repository.save(entity);
    }

    public void delete(Long id) {
        Card entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card não encontrado. ID: " + id));
        repository.delete(entity);
    }

    private void copyDtoToEntity(CardDTO dto, Card entity) {
        entity.setTitulo(dto.getTitulo());
        entity.setDescricao(dto.getDescricao());
        entity.setIcone(dto.getIcone());
        entity.setCor(dto.getCor());
    }
}