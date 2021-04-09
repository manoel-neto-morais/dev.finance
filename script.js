

//====== ABERTURA E FECHAMENTO DO MODAL ======
var btnNew = document.querySelector(".button.new")
var btnCancel = document.querySelector(".button.cancel")
/* esta versão cria um objeto Modal e coloca duas funções: open() que adiciona a a classe active e close() que remove.
const Modal = {
    open(){
        document.querySelector(".modal-overlay").classList.add('active')
    },
    close(){
        document.querySelector(".modal-overlay").classList.remove('active')
        
    }
}

btnNew.onclick = Modal.open
btnCancel.onclick = Modal.close
*/
//Esta função modal usa a função toggle() que verifica se o tonken esta na lista de classes. Se não tiver, add. Se tiver, remove.
const modal = () => {
    document.querySelector(".modal-overlay").classList.toggle('active')
}

btnNew.onclick = modal
btnCancel.onclick = modal


//====== transações ======

//array de transações: acomodará as transações cadastradas
const transactions = [
    {
        id: 1,
        description: 'luz',
        amount: -50050,
        date: '23/01/2021'
    },
    {
        id: 2,
        description: 'Website',
        amount: 60000,
        date: '01/01/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '01/01/2021'
    }
]

// objeto contendo os métodos que serão utilizados
const Transactions = {
    all: transactions,

    add(t){
        Transactions.all.push(t)
        App.reload()
    },
    
    incomes(){
        let sumIncomes = 0
        Transactions.all.forEach(t =>{
            if(t.amount > 0)
                sumIncomes += t.amount
        })
        
        return sumIncomes
    }, 
    expenses(){
        let sumExpensives = 0
        Transactions.all.forEach(t =>{
            if (t.amount < 0)
                sumExpensives += t.amount
        })
        
        return sumExpensives
    }, 
    total(){
        return Transactions.incomes() + Transactions.expenses()
    }
}
//manipula a DOM inserindo os elementos html
const DOM = {

    transactionContainer: document.querySelector('#data-table tbody'),

    //função que adiciona as transações - cria uma tr, insere o conteúdo html através da função innerHTMLTransaction e adiciona a tr recem criada no tbody trazido por transactionContainer
    addTrasaction(transaction, index){
        
        
        const tr = document.createElement("tr")
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        
        DOM.transactionContainer.appendChild(tr)
        
        
    },
    innerHTMLTransaction(transaction){
        
        //a variável CSSclass é utilada para saber se o amount da transação é maior ou enor que zero para então determinarmos a class CSS que a transação terá.
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        
        const formatAmount = Utils.formatCurrency(transaction.amount)

        //a const html vai receber toda a estrutura html já com os valores passados pelo objeto transaction.
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${formatAmount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="assets/img/minus.svg" alt="Remover transação">
            </td>
       
        `
        return html
    }, 

    //captura os elementos do balance e atualiza o seu conteudo com os metodos coorrespondentes e o aplica as formatações através do método formatCurrency
    updateBalance(){
        document.getElementById("displayIncomes").innerHTML = Utils.formatCurrency(Transactions.incomes())
        document.getElementById("displayExpensives").innerHTML = Utils.formatCurrency(Transactions.expenses())
        document.getElementById("displayTotal").innerHTML = Utils.formatCurrency(Transactions.total())
    },

    clearTransactions(){
        DOM.transactionContainer.innerHTML = ""
    }
}

//objeto de funções uteis
const Utils = {
    
    //formata os valores em formato moeda adequado
    formatCurrency(value){
        
        //capitura do sinal
        const signal = Number(value) < 0 ? "-" : ""
        
        // substituição do todo valor não numério por vazio através da expressão regular /\D/g
        value = String(value).replace(/\D/g, "")
        
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const App = {
    init(){
        //o laço forEach vai chamar o método addTransaction() de acordo com  número de elemntos do array transactions. 
        Transactions.all.forEach(t => {
            DOM.addTrasaction(t)
        })
        //atualiza o balance
        DOM.updateBalance()
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init()


transactions.push({
    id: 4,
    description: 'gas',
    amount: 40050,
    date: '21/01/2021'
})


App.reload()