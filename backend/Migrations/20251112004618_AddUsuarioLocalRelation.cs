using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuarioLocalRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdLocal",
                table: "Usuarios",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_IdLocal",
                table: "Usuarios",
                column: "IdLocal");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Locales_IdLocal",
                table: "Usuarios",
                column: "IdLocal",
                principalTable: "Locales",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Locales_IdLocal",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_IdLocal",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "IdLocal",
                table: "Usuarios");
        }
    }
}
