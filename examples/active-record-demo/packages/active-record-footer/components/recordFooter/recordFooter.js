Template.recordFooter.helpers({
  isUpsert: function () {
    if (this.type === "upsert") {
      return true;
    } else {
      return false;
    }
  }
});
