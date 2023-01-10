using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    public partial class fixPlayerIdName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerTeam_Players_Playersid",
                table: "PlayerTeam");

            migrationBuilder.RenameColumn(
                name: "Playersid",
                table: "PlayerTeam",
                newName: "PlayersId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Players",
                newName: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerTeam_Players_PlayersId",
                table: "PlayerTeam",
                column: "PlayersId",
                principalTable: "Players",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerTeam_Players_PlayersId",
                table: "PlayerTeam");

            migrationBuilder.RenameColumn(
                name: "PlayersId",
                table: "PlayerTeam",
                newName: "Playersid");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Players",
                newName: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerTeam_Players_Playersid",
                table: "PlayerTeam",
                column: "Playersid",
                principalTable: "Players",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
