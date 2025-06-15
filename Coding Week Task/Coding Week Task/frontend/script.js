let allMails = [];

async function fetchMails() {
  try {
    const response = await fetch("http://localhost:8000/api/mail/getAll");
    allMails = await response.json();
    displayMails('Primary');
    setActiveTab('primary-tab');
  } catch (error) {
    document.getElementById('mail-container').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayMails(category) {
  const mailContainer = document.getElementById('mail-container');
  const unreadCountElement = document.getElementById('unread-count');
  mailContainer.innerHTML = '';

  const filteredMails = allMails.filter(mail => mail.type.toLowerCase() === category.toLowerCase());

  if (!filteredMails.length) {
    mailContainer.innerHTML = '<p>No mails in this category.</p>';
    unreadCountElement.style.display = 'none';
    return;
  }

  let unreadCount = filteredMails.length;
  unreadCountElement.textContent = unreadCount;
  unreadCountElement.style.display = 'inline-block';

  filteredMails.forEach(mail => {
    const mailItem = document.createElement('div');
    mailItem.className = 'mail-row';

    const createdDate = new Date(mail.createdAt);
    const now = new Date();
    const isToday = createdDate.toDateString() === now.toDateString();
    const displayTime = isToday
      ? createdDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      : createdDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

    mailItem.innerHTML = `
      <div class="mail-left">
        <div class="grid-icon"><img src="icons/grid.png"></div>
        <input type="checkbox">
        <img src="icons/star.png" class="star-icon">
        <img src="icons/bookmark.png" class="bookmarkw-icon">
        <span class="mail-sender"><strong>${mail.sender}</strong></span>
      </div>
      <div class="mail-middle">
        <span class="mail-body">${mail.body}</span>
      </div>
      <div class="mail-right">
        <span class="mail-time">${displayTime}</span>
        <div class="hover-action">
          <img src="icons/archive.png" class="hover-icon">
          <img src="icons/delete.png" class="hover-icon" id="delete-btn">
          <img src="icons/read-unread.png" class="hover-icon">
          <img src="icons/snooze.png" class="hover-icon">
        </div>
      </div>
    `;

    mailItem.addEventListener('click', () => {
      if (!mailItem.classList.contains('read')) {
        mailItem.classList.add('read');
        unreadCount--;
        unreadCountElement.textContent = unreadCount > 0 ? unreadCount : '';
        if (unreadCount === 0) unreadCountElement.style.display = 'none';
      }
    });

    mailContainer.appendChild(mailItem);
  });
}

function setActiveTab(tabId) {
  document.querySelectorAll('.section-box').forEach(tab => {
    tab.classList.remove('active');
  });
  const activeTab = document.getElementById(tabId);
  if (activeTab) {
    activeTab.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('primary-tab').addEventListener('click', () => {
    displayMails('Primary');
    setActiveTab('primary-tab');
  });

  document.getElementById('promotions-tab').addEventListener('click', () => {
    displayMails('Promotions');
    setActiveTab('promotions-tab');
  });

  document.getElementById('social-tab').addEventListener('click', () => {
    displayMails('Social');
    setActiveTab('social-tab');
  });

  document.getElementById('updates-tab').addEventListener('click', () => {
    displayMails('Updates');
    setActiveTab('updates-tab');
  });

  fetchMails();
});