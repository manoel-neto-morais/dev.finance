

//====== ABERTURA E FECHAMENTO DO MODAL ======
var btnNew = document.querySelector(".button.new")
var btnCancel = document.querySelector(".button.cancel")
//esta versão cria um objeto Modal e coloca duas funções: open() que adiciona a a classe active e close() que remove.
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




/*Esta função modal usa a função toggle() que verifica se o tonken esta na lista de classes. Se não tiver, add. Se tiver, remove.
const modal = () => {
    document.querySelector(".modal-overlay").classList.toggle('active')
}
btnNew.onclick = modal
btnCancel.onclick = modal
*/

// objeto de funções de armazenamento e captura no/do localStorage
const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transaction")) || []
    }, 
    set(t){
        localStorage.setItem("dev.finances:transaction", JSON.stringify(t))
    }
}

// objeto contendo os métodos que serão utilizados
const Transactions = {
    all: Storage.get(),

    add(t){
        Transactions.all.push(t)
        App.reload()
    },

    remove(index){
        Transactions.all.splice(index, 1)
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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionContainer.appendChild(tr)
        
        
    },

    
    innerHTMLTransaction(transaction, index){
        
        //a variável CSSclass é utilada para saber se o amount da transação é maior ou enor que zero para então determinarmos a class CSS que a transação terá.
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        
        const formatAmount = Utils.formatCurrency(transaction.amount)

        //a const html vai receber toda a estrutura html já com os valores passados pelo objeto transaction.
        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${formatAmount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick = "Transactions.remove(${index})" id="btnMinus" src="assets/img/minus.svg" alt="Remover transação">
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
    },

    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        return value
    },

    formatDate(date){
        //a função split procura o token passado e quebra a string num array
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

//tratamento do formulário
const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    //validações
    validateFields(){
        const {description, amount, date } = Form.getValues()

        if (description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, preencha todos os campos!")
        }
    },

    formatValues(){
        let {description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return { description, amount, date }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(e){
        e.preventDefault() //interrompe o funcionamento padrão
        
        try{
            Form.validateFields()
            const transaction = Form.formatValues()
            Transactions.add(transaction)
            Modal.close()
        }catch(error){
            alert(error.message)
        }
 

    }
}

//fluxo da aplicação
const App = {
    init(){
        //o laço forEach vai chamar o método addTransaction() de acordo com  número de elemntos do array transactions. 
        Transactions.all.forEach((t, index) => {
            DOM.addTrasaction(t, index)
        })

        /*versão alternativa utilizando for tradicional
        for(let i = 0; i < transactions.length; i++ ){
            DOM.addTrasaction(transactions[i], i)
        }*/

        //atualiza o balance
        DOM.updateBalance()

        //atualiza o localStorage
        Storage.set(Transactions.all)
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    }
}


App.init()


