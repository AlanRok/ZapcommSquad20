Todos os direitos reservados a https://baasic.com.br
# Pré Requisitos
1. > Armazenamento não deve estar cheio
2. > Deve possuir no mínimo 8gb de ram para a virtualizalção do Docker ocorrer corretamente. Abaixo disso talvez não dê certo.

# No Backend
1. > Entrar na pasta:
2. > cd backend
3. > cp .env.example .env
3. > npm install
4. > npm run build

# Sair da pasta
1. > cd ..

# No Frontend
    > Entrar na pasta:
    > cd frontend
    > npm install

# Sair da pasta
1. > cd ..

# Fazendo o building do Docker
1. > docker-compose up --build

# ATENÇÃO APÓS CONSEGUIR RODAR TUDO NORMAL
1. Entrar no arquivo docker-compose.yml e mudar a seguintes linhas 42 a 46
    > command: >
    >  sh -c "
    >  npm run db:migrate &&
    >  npm run db:seed &&
    >  npm run dev:server"

2. Para
    > command: >
    >  sh -c "
    >  npm run dev:server"


3. Para rodar o docker-composer novamente digite o novo comando abixo
> docker-compose up
