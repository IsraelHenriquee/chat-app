// Substitua estas credenciais pelas suas do Supabase
const SUPABASE_URL = 'https://bfbloopraenbysnjfmyy.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYmxvb3ByYWVuYnlzbmpmbXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3OTY1ODEsImV4cCI6MjA0OTM3MjU4MX0.bDrPLYo-f6fsyBA3ggvx8LLwSvBuVcwU51ghfxBuStI'

// Criar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Elementos do DOM
const messagesContainer = document.getElementById('messages')
const messageInput = document.getElementById('messageInput')

// Inscrever-se nas mudanças em tempo real
supabase
    .channel('public:messages')
    .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
    }, payload => {
        addMessageToDOM(payload.new)
    })
    .subscribe()

// Função para enviar mensagem
async function sendMessage() {
    const message = messageInput.value.trim()
    if (!message) return

    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([
                { content: message }
            ])

        if (error) {
            console.error('Erro ao enviar mensagem:', error)
            throw error
        }
        messageInput.value = ''
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        alert('Erro ao enviar mensagem: ' + error.message)
    }
}

// Função para adicionar mensagem ao DOM
function addMessageToDOM(message) {
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
    messageElement.classList.add(message.is_sent ? 'sent' : 'received')
    messageElement.textContent = message.content
    messagesContainer.appendChild(messageElement)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
}

// Carregar mensagens existentes
async function loadExistingMessages() {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) {
            console.error('Erro ao carregar mensagens:', error)
            throw error
        }

        data.forEach(message => addMessageToDOM(message))
    } catch (error) {
        console.error('Erro ao carregar mensagens:', error)
        alert('Erro ao carregar mensagens: ' + error.message)
    }
}

// Carregar mensagens ao iniciar
loadExistingMessages()

// Enviar mensagem ao pressionar Enter
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage()
    }
})
