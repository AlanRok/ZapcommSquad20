Todos os direitos reservados a https://baasic.com.br

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
> docker-compose up --no-build