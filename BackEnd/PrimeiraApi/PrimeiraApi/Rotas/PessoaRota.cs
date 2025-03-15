using PrimeiraApi.Models;

namespace PrimeiraApi.Rotas;

public static class PessoaRota
{
    public static List<Pessoa> Pessoas = new()
    {
        new Pessoa(Guid.NewGuid(), "Neymar"),
        new Pessoa(Guid.NewGuid(), "Cristiano"),
        new Pessoa(Guid.NewGuid(), "Messi")
    };


    public static void MapPessoaRotas(this WebApplication app)
    {
        var rotasPessoas = app.MapGroup("pessoas");

        rotasPessoas.MapGet("", () => Pessoas);

        rotasPessoas.MapGet("/{nome}", (string nome) =>
        {
            return Pessoas
                .Find(pessoa => pessoa.Nome.StartsWith(nome));
            //.Where(pessoa => pessoa.Nome == nome);
        });

        rotasPessoas.MapPost("", (HttpContext request, Pessoa pessoa) =>
        {
            // if (pessoa.Nome != "Lucas")
            //     return Results.BadRequest(new { message = "Nome não aceito" });

            pessoa.Id = Guid.NewGuid();
            Pessoas.Add(pessoa);
            return Results.Ok(pessoa);
        });

        rotasPessoas.MapPut("/{id:guid}", (Guid id, Pessoa pessoa) =>
        {
            var encontrado = Pessoas.FirstOrDefault(p => p.Id == id);

            if (encontrado == null)
                return Results.NotFound($"O id ({id}) não foi encontrado");

            encontrado.Nome = pessoa.Nome;
            return Results.Ok(pessoa);
        });

        rotasPessoas.MapDelete("/{id:guid}", (Guid id) =>
        {
            var pessoaEncontrada = Pessoas.FirstOrDefault(pessoa => pessoa.Id == id);
            if (pessoaEncontrada == null)
                return Results.NotFound("errr");
            Pessoas.Remove(pessoaEncontrada);
            return Results.Ok("Pessoa deletada com sucesso");
        });
    }
}