const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5806945924:AAH4sGE9sAAg4PDcpJaN6PkNi8CMK1Y9E0w'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты попробуй ее отгадать`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадать',gameOptions)
}

const start = () => {

    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        if(text === '/info'){
            return  bot.sendMessage(chatId, `ты ${msg.from.first_name}`)
        }
        if(text === '/game'){
           return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')

    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again'){
            return startGame(chatId)
        }
        if(data === chats[chatId]){
            return  bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions)
        }else{
            return bot.sendMessage(chatId, `к сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
        }
    })
}
start()