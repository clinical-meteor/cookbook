//
//
// var firstUser = { text: "foo" };
// var secondUser = { text: "bar" };
//
// module.exports = {
//   tags: ["users", "entry"],
//   before: function (client){
//     // this depends on the accounts-housemd package
//     client
//       .url("http://localhost:3000")
//       .resizeWindow(1024, 768)
//       .meteorCall("removeAllUsers", false, false)
//       .pause(500);
//   },
//   "list page" : function (client) {
//     client
//       .reviewUsersListPage(0);
//   },
//   "new record" : function (client) {
//     client
//       .reviewUserPreviewPage({})
//       .upsertUser(firstUser);
//   },
//   "view record" : function (client) {
//     client
//       .reviewUserPreviewPage(firstUser);
//   },
//   "edit record" : function (client) {
//     client
//       .upsertUser(secondUser);
//   },
//   "view edited record" : function (client) {
//     client
//       .reviewUserPreviewPage(secondUser);
//   },
//   "list page" : function (client) {
//     client
//       .reviewUsersListPage()
//       .reviewUsersList(1)
//       .reviewUsersListItem(1, secondUser);
//   },
//   "table page" : function (client) {
//     client
//       .reviewUsersTablePage()
//       .reviewUsersTable(1)
//       .reviewUsersTableItem(1, secondUser);
//   },
//   "image page" : function (client) {
//     client
//       .reviewUsersImageGridPage()
//       .reviewUsersImageGrid(1)
//       .reviewUsersImageGridItem(1, secondUser);
//   },
//   after: function (client){
//     client.end();
//   }
//   // "layout page" : function (client) {
//   //   client
//   //     .reviewLayout()
//   //     .reviewCard()
//   //     .reviewModal()
//   //     .reviewCardLayout("east")
//   //     .reviewCardLayout("west");
//   // }
// };
