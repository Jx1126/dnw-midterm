function removeMessage(id) {
  const remove_message = document.getElementById(id);
  if (remove_message) {
    remove_message.remove();
  }
}
function deleteConfirmation(id) {
  if(confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
    window.location.href = `/author/delete?id=${id}`;
  }
}
function publishConfirmation(id) {
  if(confirm("Are you sure the article is ready to be published?")) {
    window.location.href = `/author/publish?id=${id}`;
  }
}