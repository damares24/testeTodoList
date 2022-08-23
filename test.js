const puppeteer = require('puppeteer');
const timeout = 600000000;

describe('TODO - LIST',
() => {

  let browser
  let page
    //Abrir o navegador
    beforeAll(async () => {
      browser = await puppeteer.launch( {headless: false});
      page = await browser.newPage();
      await page.goto(`file://${__dirname}/index.html`);
      
      
    }, timeout);
    //Fechar o navegador
    afterAll(async () => {
      await page.close()
      browser.close();
    })

    //Adicionar tarefa na lista
    it('Adicionar tarefa na lista', async () => {
      await page.waitForSelector('#newItem')
      await page.click('#newItem')
      await page.keyboard.type('Tarefa')
      await page.keyboard.press("Enter")
      await expect(page).toMatch('Tarefa')

      await page.screenshot( { path: 'adicionar.png'})
      
     

    },timeout);

    //Adiconar tarefa vazia na lista
    it('Adicionar tarefa vazia', async () => {
      await page.waitForSelector('#newItem')
      await page.click('#newItem')
      await page.keyboard.type('')
      await page.keyboard.press("Enter")
      await expect(page).toMatch('Tarefa')
      await page.screenshot( { path: 'adicionarVazio.png'})
   

    },timeout);

    //  Concluir 
    it ('Concluir Tarefa', async() => {
      await page.waitForSelector('#todoList')
      await page.click('#todoList')
      await expect(page).toClick('#todoList')
      await page.screenshot( { path: 'concluir.png'})

    },timeout);

    //Remover tarefa
    it ('Remover Tarefa', async() => {
      await page.click('label[class="todo__item"]')
      await page.waitForSelector('input[type=button][value="X"][data-indice="0"]')
      await page.click('input[type=button][value="X"][data-indice="0"]')
      await expect(page).toClick('input[type=button][value="X"][data-indice="0"]')
      await page.screenshot( { path: 'remover.png'} )

    },timeout);

})


describe("TODO - LIST", () => {
  beforeAll(async () => {
    await page.goto(`file://${__dirname}/index.html`)
  });
  
// 1° TESTE PASSOU; Criou uma tarefa vazia e retornou  1 item na lista  de tarefa
  it("passando uma tarefa qualquer", async () => {

    let item = await page.evaluate(() => {
      criarItem("qualquer", "open=true", 'xpto')
      return document.getElementById('todoList').innerHTML;
    });
    await page.screenshot({path: 'tarefa.png'});
    expect(item).not.toBeNull()

  })

 // 2° TESTE PASSOU; Esse teste não deveria passa pois recebe um argumento de uma tarefa fazia
 // quando o mesmo não deveria aceitar,  deveria ter um tratamento para esse bug no script.js para nao deixar cadastrar uma tarfera fazia 
  it("passando uma tarefa vazia para estrutura", async () => {

    let item = await page.evaluate(() => {
      criarItem("", "", '')
      return document.getElementById('todoList').innerHTML;
    });
    await page.screenshot({path: 'tarefaVazia.png'});
    expect(item).not.toBeNull()

  })

  // 3° TESTE PASSOU; Teste de expressão regular da camada de  input
  it("testando a estrutura de Input", async () => {

    let item = await page.evaluate(() => {
      criarItem("qualquer", "open=true", 'xpto')
      return document.getElementById('todoList').innerHTML;
    });
    expect(item).toMatch(/<input type="checkbox" open="true" data-indice="xpto">/)

  })

  // 4° TESTE PASSOU; Teste de expressão regular da  camada de div
  it("segundo teste da  estrutura de Div ", async () => {

    let item = await page.evaluate(() => {
      criarItem("qualquer", "open=true", 'xpto')
      return document.getElementById('todoList').innerHTML;
    });

    expect(item).toMatch('<div>qualquer</div>')

  })

  // 5° TESTE PASSOU; Teste de expressão regular completa
  it("testando a  estrutura completa da estrutura da expressão regular ", async () => {

    let item = await page.evaluate(() => {
      limparTarefas()
      criarItem("qualquer", "open=true", 'xpto')
      return document.getElementById('todoList').innerHTML;
    });

    expect(item).toMatch('<label class="todo__item">',
    '<input type="checkbox" open="true" data-indice="xpto">',
    '<div>qualquer</div>',
    '<input type="button" value="X" data-indice="xpto">',
    '</label>')

  })
   // 6° TESTE PASSOU; Teste limpando todas as tarefas da lista
  it("limpando todas as tarefas", async () => {

    let item = await page.evaluate(() => {
      criarItem("qualquer", "open=true", 'xpto')
      limparTarefas()
      return document.getElementById('todoList').innerHTML;
    });
    await page.screenshot({path: 'LimpandoTodasAsTarefas.png'});
    expect(item).toBeFalsy()

  })

  // 7° TESTE PASSOU; Teste atualizando a tarefa para receber vazia
  it("Atualizar a tela das tarefas recebendo tela vazia ", async () => {
    let item = await page.evaluate(()=> {
      criarItem("qualquer", "open=true", 'xpto')
      atualizarTela()
      let xml = document.getElementById('todoList').innerHTML;
      return xml;
    })
    await page.screenshot({path: 'AtualiazandoLimpando.png'});
    expect(item).toMatch('')
  })
  // 8° TESTE PASSOU; verifica se a tarefas na tela apos ser atualizadas
  it("atualiza tela e Verifica se a tela de tarefas foi atualizada com uma cadastrada tarefa ", async () => {
    let item = await page.evaluate(()=> {
      atualizarTela()
      criarItem("qualquer", "open=true", 'xpto')
      return document.getElementById('todoList').innerHTML;
    })
    await page.screenshot({path: 'Atualizandoeverificando.png'});
     expect(item).toMatch(/<input type="checkbox" open="true" data-indice="xpto">/)
  })

// 9° TESTE PASSOU; removendo item do da tarefa do indice 0
  it("Remove um item do banco", async ()=> {
    let item = await page.evaluate(() => {
      limparTarefas()
      criarItem("qualquer", "open=true", 'xpto');
      return document.getElementById('todoList').innerHTML;
    })
    let itemAtualiza = await page.evaluate(()=>{
      removerItem(0)
      return document.getElementById('todoList').innerHTML;
    })
    expect(itemAtualiza).not.toMatch(item);
  })

// 10° TESTE PASSOU; removendo item do da tarefa do indice 2
  it("Remove um item do banco o segundo item", async ()=> {
    let item = await page.evaluate(() => {
      limparTarefas()
      criarItem("qualquer", "open=true", 'xpto');
      criarItem("qualquer", "open=true", 'xpto');
      return document.getElementById('todoList').innerHTML;
    })
    let itemAtualiza = await page.evaluate(()=>{
      removerItem(1)
      return document.getElementById('todoList').innerHTML;
    })
    expect(itemAtualiza).not.toMatch(item);
  })

  // 11° TESTE PASSOU; removendo item do da tarefa do indice 0, 1
  it("Remove duas tarefas passando dois indices diferentes", async ()=> {
    let item = await page.evaluate(() => {
      limparTarefas()
      criarItem("qualquer", "open=true", 'xpto');
      criarItem("qualquer", "open=true", 'xpto');
      return document.getElementById('todoList').innerHTML;
    })
    let itemAtualiza = await page.evaluate(()=>{
      removerItem(0 , 1)
      return document.getElementById('todoList').innerHTML;
    })
    expect(itemAtualiza).not.toMatch(item);
  })

  // 12° TESTE  Criar um item, e apaga pelo butão de marca como finalizada.
  it("testando click de finalizar tarefa ", async () => {
    let item =  await page.evaluate(()=> {
      criarItem("qualquer", "open=true", '0')
      return document.getElementById('todoList').innerHTML;
    })  
    await page.evaluate(() => {
      let X = document.querySelectorAll(`input[type='button']`);
      X.forEach((input) => {
        input.click();
      });
    });

    item =  await page.evaluate(()=> {
      return document.getElementById('todoList').innerHTML;
    })
    expect(item).toMatch("");
  })
})


