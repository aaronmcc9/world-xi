using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    public partial class updateRecentlyAddedModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ResultTeam");

            migrationBuilder.AddColumn<int>(
                name: "TeamId",
                table: "Result",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Result_TeamId",
                table: "Result",
                column: "TeamId");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_SenderId",
                table: "Notification",
                column: "SenderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notification_User_SenderId",
                table: "Notification",
                column: "SenderId",
                principalTable: "User",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Result_Team_TeamId",
                table: "Result",
                column: "TeamId",
                principalTable: "Team",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notification_User_SenderId",
                table: "Notification");

            migrationBuilder.DropForeignKey(
                name: "FK_Result_Team_TeamId",
                table: "Result");

            migrationBuilder.DropIndex(
                name: "IX_Result_TeamId",
                table: "Result");

            migrationBuilder.DropIndex(
                name: "IX_Notification_SenderId",
                table: "Notification");

            migrationBuilder.DropColumn(
                name: "TeamId",
                table: "Result");

            migrationBuilder.CreateTable(
                name: "ResultTeam",
                columns: table => new
                {
                    ResultsId = table.Column<int>(type: "int", nullable: false),
                    TeamsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResultTeam", x => new { x.ResultsId, x.TeamsId });
                    table.ForeignKey(
                        name: "FK_ResultTeam_Result_ResultsId",
                        column: x => x.ResultsId,
                        principalTable: "Result",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ResultTeam_Team_TeamsId",
                        column: x => x.TeamsId,
                        principalTable: "Team",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ResultTeam_TeamsId",
                table: "ResultTeam",
                column: "TeamsId");
        }
    }
}
