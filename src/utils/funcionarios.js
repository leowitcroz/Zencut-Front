// Toda conta de administrador/dono é criada automaticamente com o nome
// "Admin {nomeDaLoja}" (ver tenant.service.ts -> cadastrarLojaSaaS). Ela nunca
// presta serviço nem marca horário — só administra a loja — então não deve
// aparecer como opção de barbeiro pra agendar ou organizar agenda.
export function ehContaAdmin(nome) {
    return (nome || '').trim().toLowerCase().startsWith('admin');
}
