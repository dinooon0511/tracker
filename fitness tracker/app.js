// База данных пользователей (используем localStorage для сохранения между сессиями)
let usersDB = JSON.parse(localStorage.getItem('fitnessUsers')) || [];

// Получаем все необходимые элементы DOM
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const buttonGroup = document.getElementById('buttonGroup');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginSubmit = document.getElementById('loginSubmit');
const registerSubmit = document.getElementById('registerSubmit');
const authContainer = document.getElementById('authContainer');
const profileContainer = document.getElementById('profileContainer');
const profileUsername = document.getElementById('profileUsername');
const logoutBtn = document.getElementById('logoutBtn');
const avatarWrapper = document.getElementById('avatarWrapper');
const userAvatar = document.getElementById('userAvatar');
const avatarInput = document.getElementById('avatarInput');
const userPoints = document.getElementById('userPoints');
const userHeight = document.getElementById('userHeight');
const userWeight = document.getElementById('userWeight');
const userCalories = document.getElementById('userCalories');
const userActivity = document.getElementById('userActivity');
const bottomMenu = document.getElementById('bottomMenu');
const menuGroup = document.getElementById('menuGroup');
const profileTabBtn = document.getElementById('profileTabBtn');
const settingsTabBtn = document.getElementById('settingsTabBtn');
const caloriesTabBtn = document.getElementById('caloriesTabBtn');
const tasksTabBtn = document.getElementById('tasksTabBtn');
const profileTab = document.querySelector('.profile-tab');
const settingsTab = document.querySelector('.settings-tab');
const caloriesTab = document.querySelector('.calories-tab');
const tasksTab = document.querySelector('.tasks-tab');

// Обработчики для кнопок входа и регистрации
loginBtn.addEventListener('click', function () {
  buttonGroup.classList.remove('register-active');
  buttonGroup.classList.add('login-active');
  loginBtn.classList.add('active');
  registerBtn.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
});

registerBtn.addEventListener('click', function () {
  buttonGroup.classList.remove('login-active');
  buttonGroup.classList.add('register-active');
  registerBtn.classList.add('active');
  loginBtn.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
});

// Обработчик формы входа
loginSubmit.addEventListener('click', function () {
  const login = document.getElementById('login').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!login || !password) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  // Проверяем существует ли пользователь
  const user = usersDB.find((user) => user.login === login && user.password === password);

  if (user) {
    // Пользователь найден - переходим на страницу профиля
    showProfile(login);
  } else {
    // Пользователь не найден
    alert('Такого пользователя не существует или неверный пароль');
  }
});

// Обработчик формы регистрации
registerSubmit.addEventListener('click', function () {
  const login = document.getElementById('regLogin').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const confirmPassword = document.getElementById('confirmPassword').value.trim();

  if (!login || !password || !confirmPassword) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  if (password !== confirmPassword) {
    alert('Пароли не совпадают!');
    return;
  }

  // Проверяем не занят ли логин
  const userExists = usersDB.some((user) => user.login === login);
  if (userExists) {
    alert('Пользователь с таким логином уже существует');
    return;
  }

  // Добавляем нового пользователя
  usersDB.push({
    login,
    password,
    points: 0,
    height: 175,
    weight: 70,
    calories: 2000,
    activity: 3,
  });
  localStorage.setItem('fitnessUsers', JSON.stringify(usersDB));

  alert('Регистрация успешна! Теперь вы можете войти');

  // Очищаем поля и переключаем на форму входа
  document.getElementById('regLogin').value = '';
  document.getElementById('regPassword').value = '';
  document.getElementById('confirmPassword').value = '';

  buttonGroup.classList.remove('register-active');
  buttonGroup.classList.add('login-active');
  loginBtn.classList.add('active');
  registerBtn.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
});

// Обработчик кнопки выхода
logoutBtn.addEventListener('click', function () {
  localStorage.removeItem('currentUser');
  authContainer.classList.remove('hidden');
  profileContainer.classList.add('hidden');
  bottomMenu.classList.add('hidden');
});

// Обработчик загрузки аватарки
avatarInput.addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      // Создаем новый элемент img для загруженной аватарки
      const newAvatar = document.createElement('img');
      newAvatar.src = event.target.result;
      newAvatar.style.width = '100%';
      newAvatar.style.height = '100%';
      newAvatar.style.objectFit = 'cover';
      newAvatar.style.borderRadius = '50%';

      // Очищаем контейнер и добавляем новую аватарку
      avatarWrapper.innerHTML = '';
      avatarWrapper.appendChild(newAvatar);

      // Обновляем аватар в базе данных
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        const userIndex = usersDB.findIndex((user) => user.login === currentUser);
        if (userIndex !== -1) {
          usersDB[userIndex].avatar = event.target.result;
          localStorage.setItem('fitnessUsers', JSON.stringify(usersDB));
        }
      }
    };
    reader.readAsDataURL(file);
  }
});

// Обработчики для нижнего меню
profileTabBtn.addEventListener('click', function () {
  menuGroup.classList.remove('settings-active', 'calories-active', 'tasks-active');
  menuGroup.classList.add('profile-active');
  setActiveTab('profile');
});

settingsTabBtn.addEventListener('click', function () {
  menuGroup.classList.remove('profile-active', 'calories-active', 'tasks-active');
  menuGroup.classList.add('settings-active');
  setActiveTab('settings');
});

caloriesTabBtn.addEventListener('click', function () {
  menuGroup.classList.remove('profile-active', 'settings-active', 'tasks-active');
  menuGroup.classList.add('calories-active');
  setActiveTab('calories');
});

tasksTabBtn.addEventListener('click', function () {
  menuGroup.classList.remove('profile-active', 'settings-active', 'calories-active');
  menuGroup.classList.add('tasks-active');
  setActiveTab('tasks');
});

// Функция переключения активной вкладки
function setActiveTab(tabName) {
  // Удаляем active у всех кнопок
  document.querySelectorAll('.menu-button').forEach((btn) => {
    btn.classList.remove('active');
  });

  // Скрываем все вкладки
  document.querySelectorAll('.tab-content').forEach((tab) => {
    tab.classList.remove('active');
  });

  // Активируем выбранную вкладку
  switch (tabName) {
    case 'profile':
      profileTabBtn.classList.add('active');
      profileTab.classList.add('active');
      break;
    case 'settings':
      settingsTabBtn.classList.add('active');
      settingsTab.classList.add('active');
      break;
    case 'calories':
      caloriesTabBtn.classList.add('active');
      caloriesTab.classList.add('active');
      break;
    case 'tasks':
      tasksTabBtn.classList.add('active');
      tasksTab.classList.add('active');
      break;
  }
}

// Функция показа профиля пользователя
function showProfile(username) {
  profileUsername.textContent = username;

  // Загружаем данные пользователя
  const user = usersDB.find((user) => user.login === username);
  if (user) {
    // Очищаем контейнер аватара
    avatarWrapper.innerHTML = '';

    if (user.avatar) {
      // Если есть загруженная аватарка, отображаем ее
      const avatarImg = document.createElement('img');
      avatarImg.src = user.avatar;
      avatarImg.style.width = '100%';
      avatarImg.style.height = '100%';
      avatarImg.style.objectFit = 'cover';
      avatarImg.style.borderRadius = '50%';
      avatarWrapper.appendChild(avatarImg);
    } else {
      // Если нет аватарки, отображаем стандартную иконку
      const defaultAvatar = document.createElement('img');
      defaultAvatar.className = 'default-avatar';
      defaultAvatar.src =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";
      avatarWrapper.appendChild(defaultAvatar);
    }

    userPoints.textContent = user.points || 0;
    userHeight.textContent = user.height || 175;
    userWeight.textContent = user.weight || 70;
    userCalories.textContent = user.calories || 2000;
    userActivity.textContent = user.activity || 3;
  }

  authContainer.classList.add('hidden');
  profileContainer.classList.remove('hidden');
  bottomMenu.classList.remove('hidden');

  // Активируем вкладку профиля
  setActiveTab('profile');

  // Сохраняем текущего пользователя
  localStorage.setItem('currentUser', username);
}

// Проверяем авторизацию при загрузке страницы
window.addEventListener('DOMContentLoaded', function () {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    showProfile(currentUser);
  }
});
