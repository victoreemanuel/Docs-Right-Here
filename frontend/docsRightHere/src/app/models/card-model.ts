export interface CardArquivo {
  nome: string;
  tipo: string;
  url: string;
}

export interface Card {
  id?: number; 
  titulo: string;
  descricao: string;
  icone: string;
  cor: string;
  excluido: boolean;
  arquivos: CardArquivo[];
}