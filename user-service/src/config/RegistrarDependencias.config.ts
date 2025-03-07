
import { gerenciadorDeDependencias } from "./GerenciadorDeDependencias.service";

const prismaClient = new PrismaClient();

export function registrarDependencias() {
    // gerenciadorDeDependencias.registrar('QuestaoRepository', new QuestaoRepository(prismaClient));


    // const questaoUseCase = new QuestaoUseCase(
    //     gerenciadorDeDependencias.obter('QuestaoRepository'),
    //     gerenciadorDeDependencias.obter('AlternativaRepository'),
    //     gerenciadorDeDependencias.obter('QuestaoConteudoRepository'),
    //     gerenciadorDeDependencias.obter('AlternativaCorretaRepository')
    // );
    // gerenciadorDeDependencias.registrar('QuestaoUseCase', questaoUseCase);
}
