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

function copyLink(id) {
  const articleLink = `${window.location.origin}/reader/article?id=${id}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(articleLink).then(() => {
      alert('Link copied to clipboard!');
    })
  }
}

function convertTimeFormat(time) {
  time = time.replace('T', ' ')
  const date = new Date(time);
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }

  let formattedTime = date.toLocaleDateString('en-US', options);
  formattedTime = formattedTime.replace(',', '');
  return formattedTime;
}

module.exports = {
  convertTimeFormat
}