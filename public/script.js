// START

// Purpose: Remove the toast message from the DOM
// Input: ID of the toast message
function removeMessage(id) {
  const remove_message = document.getElementById(id);
  if (remove_message) {
    remove_message.remove();
  }
}

// Purpose: Create a window alert to confirm the article deletion
// Input: ID of the article to be deleted
function deleteConfirmation(id) {
  if(confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
    // Redirect to the delete route
    window.location.href = `/author/delete?id=${id}`;
  }
}

// Purpose: Create a window alert to confirm the article publication
// Input: ID of the article to be published
function publishConfirmation(id) {
  if(confirm("Are you sure the article is ready to be published?")) {
    // Redirect to the publish route
    window.location.href = `/author/publish?id=${id}`;
  }
}

// END

// Purpose: Copy the article link to the clipboard and alert the user
// Input: ID of the article to be copied
// Reference: https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
function copyLink(id) {
  // Getthe selected article link
  const articleLink = `${window.location.origin}/reader/article?id=${id}`;

  // Copy the article link to the clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(articleLink).then(() => {
      // Alert the user that the link has been copied
      alert('Link copied to clipboard!');
    })
  }
}

// Purpose: Convert the time format to a more readable format
// Input: Time in default SQL format
// Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
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