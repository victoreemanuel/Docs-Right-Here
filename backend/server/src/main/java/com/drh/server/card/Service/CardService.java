package com.drh.server.card.Service;

import com.drh.server.card.dto.CardDTO;
import com.drh.server.card.model.Card;
import com.drh.server.card.model.CardArquivo;
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

        if (dto.getArquivos() != null) {
            entity.getArquivos().clear();
            dto.getArquivos().forEach(arqDto ->
                    entity.getArquivos().add(new com.drh.server.card.model.CardArquivo(
                            arqDto.getNome(),
                            arqDto.getTipo(),
                            arqDto.getUrl()
                    ))
            );
        }
    }

    @Autowired
    private FileStorageService fileStorageService;

    public CardDTO anexarArquivo(Long id, org.springframework.web.multipart.MultipartFile file) {
        Card entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card não encontrado. ID: " + id));

        String urlMinio = fileStorageService.uploadFile(file);

        String nomeOriginal = file.getOriginalFilename();
        String tipo = "ARQUIVO";
        if (nomeOriginal != null && nomeOriginal.contains(".")) {
            tipo = nomeOriginal.substring(nomeOriginal.lastIndexOf(".") + 1).toUpperCase();
        }

        CardArquivo novoArquivo = new CardArquivo(nomeOriginal, tipo, urlMinio);


        entity.getArquivos().add(novoArquivo);

        entity = repository.save(entity);

        return new CardDTO(entity);
    }

    public CardDTO excluirArquivo(Long id, String nomeArquivo) {
        Card entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card não encontrado. ID: " + id));

        CardArquivo arquivoParaDeletar = entity.getArquivos().stream()
                .filter(arq -> arq.getNome().equals(nomeArquivo))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Arquivo não encontrado no card: " + nomeArquivo));
        String url = arquivoParaDeletar.getUrl();
        String nomeUnicoMinio = url.substring(url.lastIndexOf("/") + 1);

        fileStorageService.deletarArquivoFisico(nomeUnicoMinio);

        entity.getArquivos().remove(arquivoParaDeletar);

        entity = repository.save(entity);
        return new CardDTO(entity);
    }

}