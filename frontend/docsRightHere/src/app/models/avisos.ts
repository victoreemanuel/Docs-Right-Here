export enum AvisoVisibilidade {
  TODOS = 'TODOS',
  PROFESSORES = 'PROFESSORES',
  SECRETARIA = 'SECRETARIA',
  DIRETORES = 'DIRETORES'
}

export interface CreateAviso {
  titulo: string,
  descricao: string,
  exp: string,
  visibilidade: AvisoVisibilidade
}

export interface RequestAviso {
  id: number,
  titulo: string,
  descricao: string,
  exp: string,
  visualizado: boolean,
  visibilidade: AvisoVisibilidade,
  nome_criador: string,
  na_lixeira: boolean
}

export interface UpdateAviso {
  aviso_id: number
}
