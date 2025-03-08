class GerenciadorDeDependencias {
    private dependencias: Map<string, unknown>;

    constructor() {
        this.dependencias = new Map();
    }

    registrar<T>(nome: string, implementacao: T): void {
        this.dependencias.set(nome, implementacao);
    }

    obter<T>(nome: string): T {
        const dependencia = this.dependencias.get(nome);
        if (!dependencia) {
            throw new Error(`Dependência ${nome} não encontrada`);
        }
        return dependencia as T;
    }
}

export const gerenciadorDeDependencias = new GerenciadorDeDependencias();
