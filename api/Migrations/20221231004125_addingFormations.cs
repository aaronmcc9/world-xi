using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    public partial class addingFormations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Formation",
                table: "Team");

            migrationBuilder.AddColumn<int>(
                name: "FormationId",
                table: "Team",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Formation",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Structure = table.Column<string>(type: "nvarchar(5)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Formation", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Formation",
                columns: new[] { "Id", "Structure" },
                values: new object[,]
                {
                    { 1, "343" },
                    { 2, "352" },
                    { 3, "424" },
                    { 4, "442" },
                    { 5, "451" },
                    { 6, "523" },
                    { 7, "532" },
                    { 8, "541" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Team_FormationId",
                table: "Team",
                column: "FormationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Team_Formation_FormationId",
                table: "Team",
                column: "FormationId",
                principalTable: "Formation",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Team_Formation_FormationId",
                table: "Team");

            migrationBuilder.DropTable(
                name: "Formation");

            migrationBuilder.DropIndex(
                name: "IX_Team_FormationId",
                table: "Team");

            migrationBuilder.DropColumn(
                name: "FormationId",
                table: "Team");

            migrationBuilder.AddColumn<string>(
                name: "Formation",
                table: "Team",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
