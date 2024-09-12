const { select, input, checkbox } = require('@inquirer/prompts')

let message = "Bem vindo ao app de Metas"

let metas = [ 
    {
        value: "Estudar 1h por dia",
        checked: false
    },
    {
        value: "Ler 10 página por dia",
        checked: false
    },
    {
        value: "Tomar 2L de água",
        checked: false
    }      
]

async function cadastrarMeta(){
    const meta = await input({message: "Digite a meta:"})

    if(meta.length == 0){
        message = "A meta não pode ser vazia."
        return
    }
    const metaJaCadastrada = metas.some((m) => m.value.toLowerCase() === meta.toLowerCase())
    
    if (metaJaCadastrada) {
        message = "Essa meta já foi cadastrada!";
        return;
    }
    
    metas.push({
        value: meta,
        checked: false
    })

    message = "Meta cadastrada com sucesso! :)";

    
}

async function listarMetas() {
    const responses =  await checkbox({
        message: "Use as setas para mudar a meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(responses.length == 0){
        message = "Nenhuma meta selecionada!"
        return
    }

    responses.forEach((responses) => {
        const meta = metas.find((m) => {
            return m.value == responses
        })

        meta.checked = true
    })

    message = "Metas(s) marcada(s) concluída(s)"
}

async function metasRealizadas() {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0){
        messsage = "Não existem metas realizadas! :("
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

async function metasAbertas() {
    const abertas = metas.filter((meta) => {
        return !meta.checked 
    })

    if(abertas.length == 0){
        message = "Não existem metas abertas! :)"
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })
}

async function deletarMetas() {
    const metasDesmarcadas = metas.map((meta) => {
        return {
            value: meta.value,
            checked: false
        } 
    })
    const deletes =  await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false
    })  
    
    if(deletes.length == 0){
        message ="Nenhum item para deletar!"
        return
    }

    deletes.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })
    message ="Meta(s) deletada(s) com sucesso!!"
}

function mostrarMensagem(){
    console.clear();

    if(message != ""){
        console.log(message)
        console.log("")
        message = ""
    }
}

async function start(){

    while(true){
        mostrarMensagem()

        const option = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })
        
        switch(option){
            
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break

            case "listar":
                await listarMetas()
                break

            case "realizadas":
                await metasRealizadas()
                break
            
            case "abertas":
                await metasAbertas()
                break

            case "deletar":
                await deletarMetas()
                break

            case "sair":
                console.log("vamos sair")
                return
        }
    }
}

start()