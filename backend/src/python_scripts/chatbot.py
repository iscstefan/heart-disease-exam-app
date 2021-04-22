from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer
import sys
import os

bot = ChatBot(
    'Covidbot',
    storage_adapter='chatterbot.storage.SQLStorageAdapter',
    logic_adapters=[
        {
            'import_path': 'chatterbot.logic.BestMatch',
            'default_response': 'I do not understand',
            'maximum_similarity_threshold': 0.6
        }
    ],
    database_uri='sqlite:///database.db',
    read_only=True
)

# trainer = ChatterBotCorpusTrainer(bot)
# trainer.train('./python_scripts/conversations.yml')

response = bot.get_response(sys.argv[1])
print(response)