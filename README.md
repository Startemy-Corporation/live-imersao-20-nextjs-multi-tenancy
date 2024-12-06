
# Live sobre Multi-tenancy com Next.js


Eu acrescentei pós live o uso do tenant id para fazer as chamadas para permitir o cache de cada tenant.

Um detalhe importante sobre o cache do Next.js ao usar headers personalizados, é que o cache será feito por cada token, ou seja, mesmo que usuários diferentes do mesmo tenant loguem, não será feito um cache compartilhado, será feito um cache por usuário, exemplo:

```typescript
 await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify({ title, description }),
  });
```

O uso de um header personalizado que será diferente para cada usuário, faz com que o cache seja feito por usuário, e não por tenant.


Para realizar um cache onde temos headers personalizados, podemos usar o `unstable_cache`, como acrescentei no código. Na versão 15, temos o `use cache`, mas ele ainda não está estável para uso. 


