# Ranking Telegram Bot

Usuários adicionam seu score (em horas) com /add, exemplo: "/add 3h30", e automaticamente o ID do usuário é inserido no banco de dados postgresql ([supabase](https://supabase.io/)).

É calculcado o ranking diário, acumulativo (durante a semana), semanal e mensal.

Exemplos:
![Ranking diário](/img/ranking-diario.png)
